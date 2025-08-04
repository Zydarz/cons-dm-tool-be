import { default as ResourceEntity } from '../entities/resource.entity';
import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table, HasMany, BelongsTo } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { UserProjectDto } from '../modules/user-projects/dto/responses/user-project-dto';
import { default as ProjectEntity } from './project.entity';
import { default as UserEntity } from './users.entity';
import { default as UserSalariesEntity } from './user-salaries.entity';

@Table({ modelName: 'user_projects' })
@UseDto(UserProjectDto)
export default class UserProjectEntity extends AbstractEntity<UserProjectDto> {
  @Column({ type: DataType.STRING })
  userId: string;
  @Column({ type: DataType.BIGINT })
  projectId: number;
  @DeletedAt
  deletedAt?: Date;
  @HasMany(() => ResourceEntity, 'userProjectId')
  resources?: ResourceEntity[];
  @HasMany(() => ResourceEntity, 'userProjectId')
  resource?: ResourceEntity;
  @BelongsTo(() => ProjectEntity, 'projectId')
  projects?: ProjectEntity;
  @BelongsTo(() => UserEntity, 'userId')
  users?: UserEntity;
  @BelongsTo(() => UserSalariesEntity, 'userId')
  userSalary?: UserSalariesEntity;
}
