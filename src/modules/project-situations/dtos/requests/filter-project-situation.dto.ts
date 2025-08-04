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
  readonly status: string = ProjectNS.Status.ALL;

  @ApiPropertyOptional()
  @IsOptional()
  readonly startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  readonly endDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  readonly projectIds: String[];
}
