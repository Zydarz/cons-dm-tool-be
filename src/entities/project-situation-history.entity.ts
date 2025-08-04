import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { BelongsTo, Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { default as UserEntity } from './users.entity';
import ProjectSituationEntity from './project-situation.entity';
import { ProjectSituationHistoryDto } from '../modules/project-situation-history/dtos/project-situation-history.dto';

@Table({ modelName: 'project_situation_histories' })
@UseDto(ProjectSituationHistoryDto)
export default class ProjectSituationHistoryEntity extends AbstractEntity<ProjectSituationHistoryDto> {
  @Column({ type: DataType.INTEGER })
  projectSituationId: number;

  @Column({ type: DataType.STRING })
  submitterId: string;

  @Column({ type: DataType.INTEGER })
  projectId: number;

  @Column({ type: DataType.TEXT('medium') })
  note: string;

  @Column({ type: DataType.DATEONLY })
  date: Date;

  @Column({ type: DataType.INTEGER })
  flag: number;

  @DeletedAt
  deletedAt: Date;

  @BelongsTo(() => ProjectSituationEntity, 'projectSituationId')
  projectSituation: ProjectSituationEntity;

  @BelongsTo(() => UserEntity, 'submitterId')
  submitter: UserEntity;
}
