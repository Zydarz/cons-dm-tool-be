import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, MaxLength, IsOptional } from 'class-validator';

export class CreateDaysOffDto {
  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  edit?: string;
}
