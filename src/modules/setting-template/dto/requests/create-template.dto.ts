import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { SettingTemplateNS } from '../../../../modules/setting-template/interface/setting-template';

export class CreateTemplateDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SettingTemplateNS.TemplateTypes)
  type?: SettingTemplateNS.TemplateTypes;

  @ApiProperty()
  @IsString()
  readonly content: string;

}
