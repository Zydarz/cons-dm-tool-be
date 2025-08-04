import { Inject } from '@nestjs/common';
import { SetChannelInformDto } from './dto/requests/set-channe-inform.dto';
import { ITeamsService } from './interfaces/teams.service.interface';
import { ITeamsRepository } from './interfaces/teams.repository.interface';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { BotSettingDto } from './dto/bot-setting.dto';
import { TeamLogsDto } from './dto/team-logs.dto';
import { Transaction } from 'sequelize';

export class TeamsService implements ITeamsService {
  constructor(@Inject('ITeamsRepository') private readonly teamRepo: ITeamsRepository) {}

  async setBotChannel(dtos: SetChannelInformDto[]): Promise<SuccessResponseDto> {
    const isSetup = await this.teamRepo.setBotChannel(dtos);
    return new SuccessResponseDto(isSetup);
  }

  async getDataTeamOfProject(projectId: number): Promise<BotSettingDto | null> {
    return await this.teamRepo.getDataTeamOfProject(projectId);
  }

  async setOneBotChannel(dto: SetChannelInformDto): Promise<BotSettingDto> {
    return await this.teamRepo.setOneBotChannel(dto);
  }

  async getErrorsFromTeam(limit: number): Promise<TeamLogsDto[]> {
    return await this.teamRepo.getErrorsFromTeam(limit);
  }

  async deleteBotSetting(projectId?: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.teamRepo.deleteBotSetting(projectId, t);
  }

  async deleteTeamLog(projectId?: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.teamRepo.deleteTeamLog(projectId, t);
  }
}
