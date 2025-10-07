import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';

export class TaskOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly startDate?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly endDate?: Date;


  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly projectId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly status?: number;

}