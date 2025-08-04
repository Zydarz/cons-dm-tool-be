import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectDto } from '../../../../modules/projects/dto/responses/project-dto';
import { ProjectSituationDto } from '../project-situation.dto';
export class ProjectSituationAllDto {
  @ApiPropertyOptional()
  month?: string;

  @ApiPropertyOptional()
  project?: ProjectDto;

  @ApiProperty()
  count: number;
  @ApiPropertyOptional()
  situations?: ProjectSituationDto[];

  @ApiPropertyOptional()
  situationsFlag?: ProjectSituationFlag[];
  constructor(
    count: number,
    situations?: ProjectSituationDto[],
    flag?: ProjectSituationFlag[],
    month?: string,
    project?: ProjectDto,
  ) {
    this.count = count;
    this.month = month;
    this.project = project;
    this.situations = situations;
    this.situationsFlag = flag;
  }
}
export class ProjectSituationFlag {
  @ApiPropertyOptional()
  name?: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  situations: ProjectSituationDto[];

  constructor(date: Date, situations: ProjectSituationDto[], name?: string, updatedAt ?: Date) {
    this.name = name;
    this.date = date;
    this.situations = situations;
    this.updatedAt = updatedAt;
  }
}
