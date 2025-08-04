import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, HasMany, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { RoleDto } from '../modules/roles/dto/response/role-dto';
import { default as PermissionEntity } from './permission.entity';
import { RoleNS } from '../modules/roles/interfaces/role';

@Table({ modelName: 'role', freezeTableName: true })
@UseDto(RoleDto)
export default class RoleEntity extends AbstractEntity<RoleDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.ENUM(RoleNS.SCOPE.ALL, RoleNS.SCOPE.DIVISION) })
  allDivision: RoleNS.SCOPE;

  @Column({ type: DataType.NUMBER })
  flag_protected: number;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => PermissionEntity, 'roleId')
  permission?: PermissionEntity;
}
