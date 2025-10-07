import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ProjectNS } from '../../../../modules/projects/interfaces/project';
import { GroupBy } from '../../../../common/constants/group-by';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';
export class FilterDto extends PageOptionsDto {
  @ApiProperty()
  @IsEnum(GroupBy)
  groupBy: GroupBy;

  @ApiPropertyOptional()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  readonly endDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  readonly projectIds: String[];


  @ApiPropertyOptional()
  @IsOptional()
  projectType?: string;
}
