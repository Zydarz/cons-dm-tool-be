import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { BotSettingDto } from '../modules/teams/dto/bot-setting.dto';

@Table({ modelName: 'bot_setting', freezeTableName: true })
@UseDto(BotSettingDto)
export default class BotSettingEntity extends AbstractEntity<BotSettingDto> {
  @Column({ type: DataType.STRING })
  projectName: string;

  @Column({ type: DataType.INTEGER })
  projectId: number;

  @Column({ type: DataType.STRING })
  groupId?: string;

  @Column({ type: DataType.STRING })
  channelId?: string;
}
