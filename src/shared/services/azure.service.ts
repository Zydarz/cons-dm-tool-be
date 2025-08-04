import 'isomorphic-fetch';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential, UsernamePasswordCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ApiConfigService } from './api-config.service';
import { first, isEmpty, isNil } from 'lodash';
import { UserDto } from '../../modules/users/dto/response/user-dto';
import { IUserSearch } from '../../interfaces/IUserSearch';
import { UserNS } from '../../modules/users/interface/users';
import { CredentialAzureType } from '../../common/constants/credential-azure-type';
import { IUserAzure } from '../../common/constants/IUserAzure';
import { ITeamsGroup } from '../../modules/teams/interfaces/teams-group.interface';
import { ITeamsChannel } from '../../modules/teams/interfaces/teams-channel.interface';
import { ChannelDto } from '../../modules/teams/dto/responses/channel.dto';

@Injectable()
export class AzureService {
  private readonly logger = new Logger(AzureService.name);

  constructor(private readonly apiConfig: ApiConfigService) {}

  private getCredential(type?: CredentialAzureType): ClientSecretCredential | UsernamePasswordCredential {
    this.logger.debug(`Getting credential for type: ${type}`);
    if (type === CredentialAzureType.USER) {
      return new UsernamePasswordCredential(
        this.apiConfig.taeantID,
        this.apiConfig.clientID,
        this.apiConfig.azureUsername,
        this.apiConfig.azurePassword,
        {},
      );
    }
    return new ClientSecretCredential(this.apiConfig.taeantID, this.apiConfig.clientID, this.apiConfig.azureSecretKey);
  }

  private getClient(type?: CredentialAzureType): Client {
    this.logger.debug(`Initializing Graph client with type: ${type}`);
    const credential = this.getCredential(type);
    const scopes = type === CredentialAzureType.USER ? [this.apiConfig.sendAzureScope] : ['.default'];
    const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes });
    return Client.initWithMiddleware({
      debugLogging: true,
      authProvider,
    });
  }

  async getUserByEmail(email: string): Promise<UserDto | undefined> {
    this.logger.log(`Fetching user by email: ${email}`);
    return this.getClient()
      .api(`/users/${email}`)
      .get()
      .then((response) => {
        this.logger.debug(`User response: ${JSON.stringify(response)}`);
        return first(response.value);
      });
  }

  async getUserByEmailByAccount(email: string): Promise<IUserAzure | undefined> {
    this.logger.log(`Fetching user by account email: ${email}`);
    const client = this.getClient(CredentialAzureType.USER);
    return client
      .api('users')
      .filter(`startswith(mail,'${email}')`)
      .get()
      .then((response) => {
        this.logger.debug(`UserByAccount response: ${JSON.stringify(response)}`);
        return first(response.value);
      });
  }

  async getUserByID(id: string): Promise<UserDto> {
    this.logger.log(`Fetching user by ID: ${id}`);
    try {
      const user = await this.getClient().api(`/users/${id}`).get();
      this.logger.debug(`User by ID response: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(`User with ID ${id} not found`, error.stack);
      throw UserNS.ERRORS.UserNotFound;
    }
  }

  async searchUsers(search: IUserSearch): Promise<UserDto[]> {
    this.logger.log(`Searching users with criteria: ${JSON.stringify(search)}`);
    let displayNameQuerry;
    let mailQuery;
    if (search.displayName) {
      displayNameQuerry = `displayName:${search.displayName}`;
    }
    if (search.mail) {
      mailQuery = `mail:${search.mail}`;
    }
    const searchQuery = [mailQuery, displayNameQuerry].filter((e) => !isNil(e)).join(' OR');
    let client = this.getClient().api('/users').header('ConsistencyLevel', 'eventual').orderby('displayName');
    if (!isEmpty(searchQuery)) {
      client = client.search(`"${searchQuery}"`);
    }
    if (search.size) {
      client = client.top(search.size);
    }
    return client.get().then((res) => {
      this.logger.debug(`Search result: ${JSON.stringify(res.value)}`);
      return res.value;
    });
  }

  async sendMessageToTeams(
    groupId: string,
    channelId: string,
    mentions: any[],
    subject: string,
    content: any,
  ): Promise<any> {
    this.logger.log(`Sending message to Teams - Group: ${groupId}, Channel: ${channelId}, Subject: ${subject}`);
    const client = this.getClient(CredentialAzureType.USER);
    return client.api(`teams/${groupId}/channels/${channelId}/messages`).post({
      subject,
      body: {
        contentType: 'html',
        content,
      },
      mentions,
    });
  }

  async getTeamMentions(
    emails: string[],
  ): Promise<{ mentionObjects: any[]; mentionTextObj: Record<string, { id: number; displayName: string }> }> {
    this.logger.log(`Generating mentions for emails: ${emails.join(', ')}`);
    const mentionObjects: any[] = [];
    const mentionTextObj: Record<string, { id: number; displayName: string }> = {};
    const users = await Promise.all(emails.map((email) => this.getUserByEmailByAccount(email)));
    users.forEach((user, id) => {
      if (!user) {
        this.logger.warn(`User not found for email: ${emails[id]}`);
        return;
      }
      mentionTextObj[user.mail] = { id, displayName: user.displayName };
      mentionObjects.push({
        id,
        mentionText: user.displayName,
        mentioned: {
          user: {
            displayName: user.displayName,
            id: user.id,
            userIdentityType: 'aadUser',
          },
        },
      });
    });
    this.logger.debug(`Mentions generated: ${JSON.stringify(mentionObjects)}`);
    return { mentionObjects, mentionTextObj };
  }

  async getAllGroupJoined(): Promise<ITeamsGroup[]> {
    this.logger.log('Fetching all joined teams');
    return this.getClient(CredentialAzureType.USER)
      .api('me/joinedTeams')
      .get()
      .then((response) => {
        this.logger.debug(`Joined teams response: ${JSON.stringify(response.value)}`);
        return response.value;
      });
  }

  async getAllChannelInGroup(groupId: string): Promise<ChannelDto[]> {
    this.logger.log(`Fetching all channels in group: ${groupId}`);
    return this.getClient(CredentialAzureType.USER)
      .api(`teams/${groupId}/channels`)
      .get()
      .then((response) => {
        const channels = response.value as ITeamsChannel[];
        this.logger.debug(`Channels fetched: ${channels.length}`);
        return channels.map((channel) => new ChannelDto(channel));
      });
  }
}
