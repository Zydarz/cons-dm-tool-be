import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, MaxLength, IsOptional } from 'class-validator';

export class UpdateDaysOffDto {
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  note?: string;
}
