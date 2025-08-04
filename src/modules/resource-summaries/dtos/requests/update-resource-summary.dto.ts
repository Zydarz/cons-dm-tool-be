import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateResourceSummaryDto {
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
  @IsNumber()
  commited?: number;

  @ApiProperty()
  @IsNumber()
  allocated?: number;

  @ApiProperty()
  @IsNumber()
  temporaryAdded?: number;
}
