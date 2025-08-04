import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateProjectSituationHistoryDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly projectSituationId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly projectId: number;

  @ApiProperty()
  @Type(() => String)
  @IsNotEmpty()
  @IsNumber()
  readonly submitterId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly note: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly date: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly flag: number;
}

export class CreateProjectSituationHistoryDtos {
  @ApiProperty({ type: [CreateProjectSituationHistoryDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateProjectSituationHistoryDto)
  createDto: CreateProjectSituationHistoryDto[];
}
