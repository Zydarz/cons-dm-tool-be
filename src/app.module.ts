import { ResourcesModule } from './modules/resources/resources.module';
import './boilerplate.polyfill';

import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { contextMiddleware } from './middlewares';
import { ExistsValidator } from './validators/exists.validator';
import { UniqueValidator } from './validators/unique.validator';
import { UserModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PositionsModule } from './modules/positions/positions.module';
import { CustomersModule } from './modules/customers/customers.module';
import { HealcheckController } from './modules/healcheck/healcheck.controller';
import { LineModule } from './modules/lines/lines.module';
import { PaymentTrackingModule } from './modules/payment-tracking/payment-tracking.module';
import { ProjectSituationsModule } from './modules/project-situations/project-situation.module';
import { ResourceSummaryModule } from './modules/resource-summaries/resource-summary.module';
import { DaysOffMoudule } from './modules/days-off/days-off.module';
import { TeamsModule } from './modules/teams/teams.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { RoleModule } from './modules/roles/role.module';
import { UserSalaryModule } from './modules/user-salary/user-salary.module';
import { OtherCostModule } from './modules/other-cost/other-cost.module';
import { SettingTemplateModule } from './modules/setting-template/setting-template.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ProjectsModule,
    PositionsModule,
    CustomersModule,
    ResourcesModule,
    LineModule,
    PaymentTrackingModule,
    ProjectSituationsModule,
    ResourceSummaryModule,
    DaysOffMoudule,
    TeamsModule,
    MasterDataModule,
    RoleModule,
    UserSalaryModule,
    OtherCostModule,
    SettingTemplateModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    // I18nModule.forRootAsync({
    //   useFactory: (configService: ApiConfigService) => ({
    //     fallbackLanguage: configService.fallbackLanguage,
    //     parserOptions: {
    //       path: path.join(__dirname, '/i18n/'),
    //       watch: configService.isDevelopment,
    //     },
    //   }),
    //   imports: [SharedModule],
    //   parser: I18nJsonParser,
    //   inject: [ApiConfigService],
    // }),
  ],
  controllers: [HealcheckController],
  providers: [UniqueValidator, ExistsValidator],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
