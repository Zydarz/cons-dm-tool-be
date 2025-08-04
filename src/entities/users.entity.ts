import { UserNS } from '../modules/users/interface/users';
import { Table, Column, Model, DataType, HasMany, BelongsTo } from 'sequelize-typescript';
import { default as UserProjectEntity } from './user_project.entity';
import { default as LineEntity } from './line.entity';
import { default as JobRankEntity } from './job-rank.entity';
import { default as DepartmentEntity } from './department.entity';
import { default as UserSalariesEntity } from './user-salaries.entity';
import { AbstractEntity } from '../common/abstract.entity';
import { UserPaggingDto } from '../modules/users/dto/response/user-pagging-dto';
import { UseDto } from '../decorators/use-dto.decorator';

const ROLES = UserNS.Roles;
const STATUS = UserNS.Status;
const USERTYPE = UserNS.Type;
const PaymentType = UserNS.PaymentType;
@Table({ modelName: 'users' })
@UseDto(UserPaggingDto)
export default class UserEntity  extends AbstractEntity<UserPaggingDto> {
  @Column({ type: DataType.STRING, unique: true, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING })
  idGoogle?: string;

  @Column({ type: DataType.STRING })
  employeeId: string;

  @Column({ type: DataType.NUMBER })
  lineId: number;

  @Column({ type: DataType.NUMBER })
  jobRankId: number;

  @Column({ type: DataType.NUMBER })
  departmentId: number;

  @Column({ type: DataType.STRING })
  mail: string;

  @Column({ type: DataType.STRING })
  displayName: string;

  @Column({ type: DataType.STRING })
  givenName?: string;

  @Column({ type: DataType.STRING })
  surName?: string;

  @Column({ type: DataType.STRING })
  bankId?: string;

  @Column({ type: DataType.STRING })
  bankName?: string;

  @Column({ type: DataType.STRING })
  bankAccountHolder?: string;

  @Column({ type: DataType.ENUM(USERTYPE.FULLTIMEC, USERTYPE.FULLTIMET, USERTYPE.INTERN, USERTYPE.PARTTIME) })
  type?: UserNS.Type;

  @Column({ type: DataType.NUMBER })
  dependent?: number;

  @Column({ type: DataType.NUMBER })
  socialInsuranceSalary: number;

  @Column({ type: DataType.ENUM(PaymentType.CK, PaymentType.TM) })
  paymentType?: UserNS.PaymentType;

  @Column({ type: DataType.ENUM(ROLES.ADMIN, ROLES.LOS, ROLES.MEMBER) })
  role?: UserNS.Roles;

  @Column({ type: DataType.NUMBER })
  roleId: number;

  @Column({ type: DataType.ENUM(STATUS.ACTIVE, STATUS.INACTIVE, STATUS.DISABLE) })
  status?: UserNS.Status;

  @Column({ type: DataType.STRING })
  username?: string;

  @Column({ type: DataType.NUMBER })
  salaryDefault: number;

  @Column({ type: DataType.NUMBER })
  flagOnsite?: number;

  @Column({ type: DataType.STRING })
  note?: string;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Column({ type: DataType.DATE })
  deletedAt?: Date;

  @HasMany(() => UserProjectEntity, 'userId')
  userProjects?: UserProjectEntity[];

  @HasMany(() => UserProjectEntity, 'userId')
  userProject?: UserProjectEntity;

  @BelongsTo(() => LineEntity, 'lineId')
  line: LineEntity;

  @BelongsTo(() => JobRankEntity, 'jobRankId')
  jobRank: JobRankEntity;

  @BelongsTo(() => DepartmentEntity, 'departmentId')
  department: DepartmentEntity;

  @HasMany(() => UserSalariesEntity, 'userId')
  userSalaries?: UserSalariesEntity[];


}
