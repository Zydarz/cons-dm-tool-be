import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SettingTemplateNS } from './../../interface/setting-template';

export class TemplateFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  title: String;

  @ApiPropertyOptional()
  @IsOptional()
  type?: SettingTemplateNS.TemplateTypes;
}
