import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateProjectSituationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly projectId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly note: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly date: Date;
}

export class CreateProjectSituationDtos {
  @ApiProperty({ type: [CreateProjectSituationDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateProjectSituationDto)
  createDto: CreateProjectSituationDto[];
}
