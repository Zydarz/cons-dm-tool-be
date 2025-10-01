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
import { default as ProjectStatusBiddingEntity } from './project-status-bidding.entity';
import { default as ProjectStatusDevelopmentEntity } from './project-status-development.entity';
import { default as ProjectDomainEntity } from './project-domain.entity';
import { default as ProjectPriorityEntity } from './project-priority.entity';

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

  @Column({ type: DataType.STRING })
  type: string;

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

  // Các trường mới được thêm trước đó
  @Column({ type: DataType.STRING, allowNull: true })
  backLogId?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  techStack?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  market?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  statusBidding?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  statusDevelopment?: number;

  // 3 trường dữ liệu mới được bổ xung
  @Column({ type: DataType.STRING(255), allowNull: true })
  application?: string;

  @Column({ type: DataType.DOUBLE(8, 2), allowNull: true })
  budgetCustomer?: number;

  @Column({ type: DataType.DATE, allowNull: true })
  feedbackDate?: Date;

  // 5 trường mới cần bổ sung
  @Column({ type: DataType.STRING(3000), allowNull: true })
  wbsLink?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  departmentIds?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  winRate?: number;

  @Column({ type: DataType.STRING(100), allowNull: true })
  domains?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  priority?: number;

  @DeletedAt
  deletedAt: Date;

  // Existing relationships
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

  // Thêm relationships mới cho status bidding và development
  @BelongsTo(() => ProjectStatusBiddingEntity, 'statusBidding')
  projectStatusBidding?: ProjectStatusBiddingEntity;

  @BelongsTo(() => ProjectStatusDevelopmentEntity, 'statusDevelopment')
  projectStatusDevelopment?: ProjectStatusDevelopmentEntity;

  @BelongsTo(() => ProjectPriorityEntity, 'priority')
  projectPriority?: ProjectPriorityEntity;
}