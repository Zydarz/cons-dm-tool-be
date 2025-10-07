import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { TrimStartAndEnd } from '../../../../decorators/transforms.decorator';

export class CreateTaskDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly taskId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly projectId?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  readonly createdBy: number;

  @ApiProperty()
  @IsString()
  @TrimStartAndEnd()
  @IsNotEmpty()
  readonly creator: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @TrimStartAndEnd()
  readonly content?: string;
}