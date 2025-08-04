import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';
import { BotSettingDto } from '../dto/bot-setting.dto';
import { SetChannelInformDto } from '../dto/requests/set-channe-inform.dto';
import { TeamLogsDto } from '../dto/team-logs.dto';

export interface ITeamsRepository {
  setBotChannel(dtos: SetChannelInformDto[]): Promise<boolean>;
  getDataTeamOfProject(projectId: number): Promise<BotSettingDto | null>;
  setOneBotChannel(dto: SetChannelInformDto): Promise<BotSettingDto>;
  getErrorsFromTeam(limit: number): Promise<TeamLogsDto[]>;
  deleteBotSetting(projectId?: number, t?: Transaction): Promise<SuccessResponseDto>;
  deleteTeamLog(projectId?: number, t?: Transaction): Promise<SuccessResponseDto>;
}
