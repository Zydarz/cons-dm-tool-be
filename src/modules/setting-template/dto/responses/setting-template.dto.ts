import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as SettingTemplateEntity } from 'entities/setting_template.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SettingTemplateNS } from '../../../setting-template/interface/setting-template';

const TemplateTypes = SettingTemplateNS.TemplateTypes;
export class SettingTemplateDto extends AbstractDto {

  @ApiProperty()
  userUpdateId: String;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: [TemplateTypes.MESSAGE, TemplateTypes.Mail, TemplateTypes.NOTIFY, TemplateTypes.SITUATION]})
  @IsString()
  type: SettingTemplateNS.TemplateTypes;

  @ApiProperty()
  content: string;

  constructor(template: SettingTemplateEntity) {
    super(template);
    this.title = template.title;
    this.userUpdateId = template.userUpdateId;
    this.type = template.type;
    this.content = template.content;
  }
}
