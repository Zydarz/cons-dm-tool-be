import { AbstractEntity } from '../common/abstract.entity';
import { BelongsTo, Column, DataType, DeletedAt, HasMany, HasOne, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { ProjectDto } from '../modules/projects/dto/responses/project-dto';
import { default as UserProjectEntity } from './user_project.entity';
import { ProjectNS } from '..//modules/projects/interfaces/project';
import { default as UserEntity } from './users.entity';
import { default as BotSettingEntity } from './bot-setting.entity';
import { default as PaymentEntity } from './payment-tracking.entity';
import { default as ContractTypeEntity } from './contract-type.entity';
import { default as CustomerEntity } from './customer.entity';
import { default as DepartmentEntity } from './department.entity';

const TYPE = ProjectNS.Type;
const CURRENCY = ProjectNS.Currency;
const STATUS = ProjectNS.Status;
@Table({ modelName: 'projects' })
@UseDto(ProjectDto)
export default class ProjectEntity extends AbstractEntity<ProjectDto> {
  @Column({ type: DataType.INTEGER })
  customerId?: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  code: string;

  @Column({ type: DataType.ENUM(TYPE.LABO, TYPE.FIXED) })
  type: ProjectNS.Type;

  @Column({ type: DataType.TEXT })
  am?: string;

  @Column({ type: DataType.TEXT })
  pm?: string;

  @Column({ type: DataType.DATE })
  startDate: Date;

  @Column({ type: DataType.DATE })
  endDate: Date;

  @Column({ type: DataType.DATE })
  startDateActual?: Date;

  @Column({ type: DataType.DATE })
  endDateActual?: Date;

  @Column({ type: DataType.ENUM(CURRENCY.YEN, CURRENCY.DOLA, CURRENCY.VND) })
  currency: ProjectNS.Currency;

  @Column({ type: DataType.NUMBER })
  departmentId: number;

  @Column({ type: DataType.ENUM(STATUS.BIDDING, STATUS.OPEN, STATUS.RUNNING, STATUS.CLOSED, STATUS.CLOSING) })
  status: ProjectNS.Status;

  @Column({ type: DataType.DOUBLE })
  billable?: number;

  @Column({ type: DataType.DOUBLE })
  budget?: number;

  @Column({ type: DataType.DOUBLE })
  internalPrice?: number;

  @Column({ type: DataType.DOUBLE })
  externalPrice?: number;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => UserProjectEntity, 'projectId')
  userProjects?: UserProjectEntity[];

  @HasMany(() => UserProjectEntity, 'projectId')
  userProject?: UserProjectEntity;

  @HasMany(() => UserEntity, 'id')
  user?: UserEntity[];

  @HasMany(() => PaymentEntity, 'projectId')
  payments?: PaymentEntity[];

  @HasOne(() => BotSettingEntity, { sourceKey: 'id', foreignKey: 'projectId' })
  botSetting?: BotSettingEntity;

  @BelongsTo(() => ContractTypeEntity, 'contractTypeId')
  contractType?: ContractTypeEntity;

  @BelongsTo(() => CustomerEntity, 'customerId')
  customer?: CustomerEntity;

  @BelongsTo(() => DepartmentEntity, 'departmentId')
  department: DepartmentEntity;
}
