import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';

export class RequestLogWorkDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly reportDate?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly activity?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Length(1, 100)
  readonly taskId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  readonly actualEffort?: number;

   @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly projectId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly memberId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly note?: string;
}
