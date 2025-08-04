import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AllocateGroupType } from '../../../../common/constants/allocate-group-type';
import { ProjectNS } from '../../../../modules/projects/interfaces/project';
import { IsArray } from 'sequelize-typescript';

export class ResourceProjectFilterDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProjectNS.Status)
  readonly status?: ProjectNS.Status;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly endDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectIds?: string;

  @ApiProperty({ enum: AllocateGroupType })
  @IsEnum(AllocateGroupType)
  readonly allocateGroupType: AllocateGroupType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  option?: string;

  @ApiPropertyOptional()
  @IsOptional()
  divisionIds?: number[];
}
