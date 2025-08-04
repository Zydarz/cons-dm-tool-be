import { Transaction } from 'sequelize';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { BotSettingDto } from '../dto/bot-setting.dto';
import { SetChannelInformDto } from '../dto/requests/set-channe-inform.dto';
import { TeamLogsDto } from '../dto/team-logs.dto';

export interface ITeamsService {
  setBotChannel(dtos: SetChannelInformDto[]): Promise<SuccessResponseDto>;
  getDataTeamOfProject(projectId: number): Promise<BotSettingDto | null>;
  setOneBotChannel(dto: SetChannelInformDto): Promise<BotSettingDto>;
  getErrorsFromTeam(limit: number): Promise<TeamLogsDto[]>;
  deleteBotSetting(projectId?: number, t?: Transaction): Promise<SuccessResponseDto>;
  deleteTeamLog(projectId?: number, t?: Transaction): Promise<SuccessResponseDto>;
}
