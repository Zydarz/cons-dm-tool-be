import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { default as LogWorkEntity } from '../../../../entities/log-work.entity';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserProjectDto } from '../../../../modules/user-projects/dto/responses/user-project-dto';
import { DailyReportActivitiesDto } from '../../../../modules/master-data/dtos/master-data.dto';

export class LogWorkDto extends AbstractDto {
  @ApiProperty()
  readonly userProjectId: number;

  @ApiPropertyOptional()
  readonly reportDate?: Date;

  @ApiPropertyOptional()
  readonly activity?: string;

    @ApiPropertyOptional()
  readonly projectName?: string;

  @ApiPropertyOptional()
  readonly dailyReportActivity?: DailyReportActivitiesDto;

  @ApiPropertyOptional()
  readonly taskId?: string;

  @ApiPropertyOptional()
  readonly actualEffort?: number;

  @ApiPropertyOptional()
  readonly note?: string;

  @ApiPropertyOptional()
  userProject?: UserProjectDto;

  constructor(logWorkEntity: LogWorkEntity) {
    super(logWorkEntity);
    this.userProjectId = logWorkEntity.userProjectId;
    this.reportDate = logWorkEntity.reportDate;
    this.activity = logWorkEntity.dailyReportActivity?.name;
    this.projectName = logWorkEntity.userProject?.projects?.name;
    
    this.dailyReportActivity = logWorkEntity.dailyReportActivity?.toDto();
    this.taskId = logWorkEntity.taskId;
    this.actualEffort = logWorkEntity.actualEffort;
    this.note = logWorkEntity.note;
    this.userProject = logWorkEntity.userProject?.toDto();
  }
}
