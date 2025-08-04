import { AbstractEntity } from '../common/abstract.entity';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { default as ProjectEntity } from './project.entity';
import { TeamLogsDto } from '../modules/teams/dto/team-logs.dto';

@Table({ modelName: 'team_logs', freezeTableName: true })
@UseDto(TeamLogsDto)
export default class TeamLogsEntity extends AbstractEntity<TeamLogsDto> {
  @Column({ type: DataType.INTEGER })
  projectId: number;

  @Column({ type: DataType.STRING })
  errorMessage: string;

  @BelongsTo(() => ProjectEntity, { foreignKey: 'projectId', targetKey: 'id' })
  project: ProjectEntity;
}
