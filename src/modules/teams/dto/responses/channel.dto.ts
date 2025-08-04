import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ITeamsChannel } from '../../interfaces/teams-channel.interface';

export type TeamsChannelDtoOptions = Partial<{ isActive: boolean }>;

export class ChannelDto {
  @ApiProperty()
  channelId: string;

  @ApiProperty()
  channelName: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(teamsChannel: ITeamsChannel, options?: TeamsChannelDtoOptions) {
    this.channelId = teamsChannel.id;
    this.channelName = teamsChannel.displayName;
    this.isActive = options?.isActive;
  }
}
