import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { BelongsTo, Column, DataType, DeletedAt, HasMany, Table } from 'sequelize-typescript';
import { default as ProjectEntity } from './project.entity';
import { default as UserEntity } from './users.entity';
import { ProjectSituationDto } from '../modules/project-situations/dtos/project-situation.dto';
import ProjectSituationHistoryEntity from './project-situation-history.entity';

@Table({ modelName: 'project_situations' })
@UseDto(ProjectSituationDto)
export default class ProjectSituationEntity extends AbstractEntity<ProjectSituationDto> {
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

  @BelongsTo(() => UserEntity, 'submitterId')
  submitter: UserEntity;

  @BelongsTo(() => ProjectEntity, 'projectId')
  project?: ProjectEntity;

  @HasMany(() => ProjectSituationHistoryEntity, 'projectSituationId')
  projectSituationHistory?: ProjectSituationHistoryEntity[];
}
