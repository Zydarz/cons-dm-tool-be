import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
import path from 'path';
import type { Dialect } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE').toLowerCase();
  }

  get cacheModuleConfig(): {
    host: string;
    port: number;
    pass: string;
    ttl: number;
  } {
    return {
      host: this.getString('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      pass: this.getString('REDIS_PASS'),
      ttl: this.getNumber('CACHE_TTL'),
    };
  }

  private getDialect(key: string): Dialect {
    const value = this.get(key).replace(/\\n/g, '\n');
    return (value as Dialect) || 'mysql';
  }

  get databaseConfig(): Sequelize {
    const sequelize = new Sequelize({
      username: this.getString('DATABASE_USER'),
      password: this.getString('DATABASE_PASSWORD'),
      database: this.getString('DATABASE_NAME'),
      host: this.getString('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      dialect: this.getDialect('DATABASE_DIALECT'),
      logging: false,
      modelPaths: [path.join(__dirname + '../../../entities')],
      pool: {
        max: 10,
        min: 0,
        idle: 1000,
      },
    });
    return sequelize;
  }

  get azureAADConfig(): {
    identityMetadata: string;
    issuer: string;
    tenantId: string;
    clientID: string;
    audience: string;
    validateIssuer: boolean;
    passReqToCallback: boolean;
    loggingLevel: string;
    scope: Array<string>;
  } {
    const tenantId = this.getString('TENANT_ID');
    const metaDataDiscovery = this.getString('METADATA_DISCOVERY');
    const clientID = this.getString('CLIENT_ID');
    const scope = this.getString('SCOPE').split(',');
    return {
      identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/${metaDataDiscovery}`,
      issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      tenantId,
      clientID,
      audience: clientID,
      validateIssuer: true,
      passReqToCallback: false,
      loggingLevel: 'info',
      scope,
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig(): {
    host: string;
    port: number;
  } {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig(): {
    jwtSecret: string;
    jwtExpirationTime: number;
  } {
    return {
      jwtSecret: this.getString('JWT_SECRET_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig(): { port: string } {
    return {
      port: this.getString('PORT'),
    };
  }

  get ssoConfig(): {
    identityMetadata: string;
    clientID: string;
    audience: string;
    policyName: string;
    isB2C: boolean;
    validateIssuer: boolean;
    loggingLevel: string;
    passReqToCallback: boolean;
  } {
    const tenantName = this.getString('TENANT_NAME');
    const policyName = this.getString('POLICY_NAME');
    const metaDataDiscovery = this.getString('METADATA_DISCOVERY');
    const clientID = this.getString('CLIENT_ID');
    return {
      identityMetadata: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${policyName}/v2.0/${metaDataDiscovery}`,
      clientID,
      audience: clientID,
      policyName,
      isB2C: true,
      validateIssuer: true,
      loggingLevel: 'info',
      passReqToCallback: false,
    };
  }

  get taeantID(): string {
    return this.getString('TENANT_ID');
  }

  get clientID(): string {
    return this.getString('CLIENT_ID');
  }

  get azureUsername(): string {
    return this.getString('AZURE_USERNAME');
  }

  get azurePassword(): string {
    return this.getString('AZURE_PASSWORD');
  }

  get azureScope(): string {
    return this.getString('SCOPE');
  }

  get azureSecretKey(): string {
    return this.getString('AZURE_SECRET_KEY');
  }

  get sendAzureScope(): string {
    return this.getString('SEND_AZURE_SCOPE');
  }

  get groupIdTeam(): string {
    return this.getString('GROUP_ID_TEAM');
  }

  get channelIdTeam(): string {
    return this.getString('CHANNEL_ID_TEAM');
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
