import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateResourceSummaryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  commited?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  allocated?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  temporaryAdded?: number;
}
