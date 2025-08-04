import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, HasMany, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { DepartmentDto } from '../modules/master-data/dtos/master-data.dto';
import { default as UserEntity } from './users.entity';

@Table({ modelName: 'department', freezeTableName: true })
@UseDto(DepartmentDto)
export default class DepartmentEntity extends AbstractEntity<DepartmentDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.NUMBER })
  flag_protected: number;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => UserEntity, 'departmentId')
  users: UserEntity[];
}
