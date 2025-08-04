import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class AcTcParamDto {
  @ApiProperty()
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsDateString()
  readonly month: Date;
}
