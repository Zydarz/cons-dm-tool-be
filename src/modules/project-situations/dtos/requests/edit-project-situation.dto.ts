import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class EditProjectSituationDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly projectId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  readonly note?: string;

  @ApiProperty()
  @IsDateString()
  readonly date?: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly flag: number;
}
export class EditProjectSituationDtos {
  @ApiProperty({ type: [EditProjectSituationDto] })
  @ValidateNested({ each: true })
  @Type(() => EditProjectSituationDto)
  editDto: EditProjectSituationDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  edit: string;
}
