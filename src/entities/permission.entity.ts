import { AbstractEntity } from '../common/abstract.entity';
import { BelongsTo, Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { default as RoleEntity } from './role.entity';
import { PermissionDto } from '../modules/permission/dto/response/permission-dto';
import { PermissionNS } from '../modules/permission/interfaces/permission';

const ACTION = PermissionNS.ACTION;
@Table({ modelName: 'permisson', freezeTableName: true })
@UseDto(PermissionDto)
export default class PermissionEntity extends AbstractEntity<PermissionDto> {
  @Column({ type: DataType.STRING })
  path: string;

  @Column({ type: DataType.STRING })
  method: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.ENUM(ACTION.EXC, ACTION.ONLY, ACTION.BLOCK) })
  action: PermissionNS.ACTION;

  @Column({ type: DataType.INTEGER })
  roleId: number;

  @BelongsTo(() => RoleEntity, 'roleId')
  role?: RoleEntity;

  @DeletedAt
  deletedAt: Date;
}
