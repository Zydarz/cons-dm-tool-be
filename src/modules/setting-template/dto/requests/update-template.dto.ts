import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTemplateDto {

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;
}
