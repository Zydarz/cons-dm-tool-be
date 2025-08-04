import { Inject } from '@nestjs/common';
import { ITeamsRepository } from '../modules/teams/interfaces/teams.repository.interface';
import { default as BotSettingEntity } from '../entities/bot-setting.entity';
import { SetChannelInformDto } from '../modules/teams/dto/requests/set-channe-inform.dto';
import { BotSettingDto } from '../modules/teams/dto/bot-setting.dto';
import { TeamLogsDto } from '../modules/teams/dto/team-logs.dto';
import { default as TeamLogsEntity } from '../entities/team-logs.entity';
import { default as ProjectEntity } from '../entities/project.entity';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { isNil } from 'lodash';
import { Transaction } from 'sequelize';

export class TeamsRepository implements ITeamsRepository {
  constructor(
    @Inject(BotSettingEntity.name) private readonly botSettingEntity: typeof BotSettingEntity,
    @Inject(TeamLogsEntity.name) private readonly teamLogsEntity: typeof TeamLogsEntity,
  ) {}

  async setBotChannel(dtos: SetChannelInformDto[]): Promise<boolean> {
    for (const dto of dtos) {
      const botSetting = new BotSettingEntity(dto);
      await botSetting.save();
    }
    return true;
  }

  async getDataTeamOfProject(projectId: number): Promise<BotSettingDto | null> {
    const botSetting = await this.botSettingEntity.findOne({
      where: { projectId },
    });
    return botSetting?.toDto() ?? null;
  }

  async setOneBotChannel(dto: SetChannelInformDto): Promise<BotSettingDto> {
    let botSetting = await this.botSettingEntity.findOne({
      where: {
        projectId: dto.projectId,
      },
    });
    if (!botSetting) {
      botSetting = new BotSettingEntity(dto);
    }
    botSetting.channelId = dto.channelId;
    botSetting.groupId = dto.groupId;
    botSetting.projectName = dto.projectName;
    await botSetting.save();
    return botSetting.toDto();
  }

  async getErrorsFromTeam(limit: number): Promise<TeamLogsDto[]> {
    const logs = await this.teamLogsEntity.findAll({
      limit,
      include: [
        {
          model: ProjectEntity,
          as: 'project',
        },
      ],
    });
    return logs.toDtos();
  }

  async deleteBotSetting(projectId?: number, t?: Transaction): Promise<SuccessResponseDto> {
    const condition = {};

    if (!isNil(projectId)) {
      Object.assign(condition, {
        projectId,
      });
    }

    await this.botSettingEntity.destroy({
      where: condition,
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }

  async deleteTeamLog(projectId?: number, t?: Transaction): Promise<SuccessResponseDto> {
    const condition = {};

    if (!isNil(projectId)) {
      Object.assign(condition, {
        projectId,
      });
    }

    await this.teamLogsEntity.destroy({
      where: condition,
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }
}
