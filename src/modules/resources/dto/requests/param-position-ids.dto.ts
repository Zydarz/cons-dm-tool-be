import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class ParamPositionIdsDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly startDate?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly endDate?: Date;

}
