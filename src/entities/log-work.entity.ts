import { BelongsTo, Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { LogWorkDto } from '../modules/log-works/dto/responses/log-work-dto';
import { LogWorkNS } from '../modules/log-works/interfaces/logwork-interface';
import { default as UserProjectEntity } from './user_project.entity';
import { default as DailyReportActivitiesEntity } from './daily-report-activities.entity';

const ACTIVITY = LogWorkNS.LogWorkActivity;
@Table({ modelName: 'log_works' })
@UseDto(LogWorkDto)
export default class LogWorkEntity extends AbstractEntity<LogWorkDto> {
  @Column({ type: DataType.INTEGER })
  userProjectId: number;

  @Column({ type: DataType.DATE })
  reportDate?: Date;

  @Column({
    type: DataType.ENUM(
      ACTIVITY.Coding,
      ACTIVITY.DevOps,
      ACTIVITY.Investigate,
      ACTIVITY.Management,
      ACTIVITY.Other,
      ACTIVITY.Report,
      ACTIVITY.ReviewCD,
      ACTIVITY.ReviewTC,
      ACTIVITY.Test,
      ACTIVITY.Trans,
    ),
  })
  readonly activity?: LogWorkNS.LogWorkActivity;

  @Column({ type: DataType.STRING })
  readonly taskId?: string;

  @Column({ type: DataType.DOUBLE })
  readonly actualEffort?: number;

  @Column({ type: DataType.TEXT })
  readonly note?: string;

  @DeletedAt
  deletedAt: Date;

  @BelongsTo(() => UserProjectEntity, 'userProjectId')
  userProject?: UserProjectEntity;

  @BelongsTo(() => DailyReportActivitiesEntity, 'dailyReportActivitiesId')
  dailyReportActivity?: DailyReportActivitiesEntity;
}
