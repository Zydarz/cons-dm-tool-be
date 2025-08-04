import { AbstractDto } from '../../../common/dto/abstract.dto';
import { default as BotSettingEntity } from '../../../entities/bot-setting.entity';

export class BotSettingDto extends AbstractDto {
  projectId: number;
  projectName: string;
  channelId?: string;
  groupId?: string;

  constructor(botSettingEntity: BotSettingEntity) {
    super(botSettingEntity);
    this.projectName = botSettingEntity.projectName;
    this.projectId = botSettingEntity.projectId;
    this.channelId = botSettingEntity.channelId;
    this.groupId = botSettingEntity.groupId;
  }
}
