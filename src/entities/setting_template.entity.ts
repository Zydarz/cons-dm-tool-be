import { AbstractEntity } from '../common/abstract.entity';
import { BelongsTo, Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { SettingTemplateNS } from '../modules/setting-template/interface/setting-template';
import { SettingTemplateDto } from '../modules/setting-template/dto/responses/setting-template.dto';
import { default as UserEntity } from './users.entity';

const TemplateTypes = SettingTemplateNS.TemplateTypes;
@Table({ modelName: 'setting_template', freezeTableName: true })
@UseDto(SettingTemplateDto)
export default class SettingTemplateEntity extends AbstractEntity<SettingTemplateDto> {
  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.ENUM(TemplateTypes.MESSAGE, TemplateTypes.Mail, TemplateTypes.NOTIFY, TemplateTypes.SITUATION) })
  type: SettingTemplateNS.TemplateTypes;

  @Column({ type: DataType.STRING })
  content: string;

  @Column({ type: DataType.STRING })
  userUpdateId: string;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => UserEntity, 'userUpdateId')
  users?: UserEntity;

}
