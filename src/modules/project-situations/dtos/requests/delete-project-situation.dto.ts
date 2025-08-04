import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DeleteProjectSituationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  flag: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  delete: string;
}
