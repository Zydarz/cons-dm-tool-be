import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table, HasMany, BelongsTo } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { UserNS } from '../modules/users/interface/users';
import { UserSalaryPaggingDto } from '../modules/user-salary/dto/responses/user-salary-paging.dto';
import { default as UserEntity } from './users.entity';
import DepartmentEntity from './department.entity';

const TYPE = UserNS.Type;
const STATUS = UserNS.Status;
const PaymentType = UserNS.PaymentType;
@Table({ modelName: 'user_salaries', freezeTableName: true })
@UseDto(UserSalaryPaggingDto)
export default class UserSalariesEntity extends AbstractEntity<UserSalaryPaggingDto> {
  @Column({ type: DataType.STRING })
  userId: string;

  @Column({ type: DataType.DOUBLE })
  salary: number;

  @Column({ type: DataType.STRING })
  bankId?: string;

  @Column({ type: DataType.STRING })
  bankName?: string;

  @Column({ type: DataType.ENUM(TYPE.FULLTIMEC, TYPE.FULLTIMET, TYPE.INTERN, TYPE.PARTTIME) })
  type?: UserNS.Type;

  @Column({ type: DataType.ENUM(STATUS.ACTIVE, STATUS.DISABLE, STATUS.INACTIVE) })
  status?: UserNS.Status;

  @Column({ type: DataType.NUMBER })
  dependent?: number;

  @Column({ type: DataType.NUMBER })
  socialInsuranceSalary: number;

  @Column({ type: DataType.ENUM(PaymentType.CK, PaymentType.TM) })
  paymentType?: UserNS.PaymentType;

  @Column({ type: DataType.INTEGER })
  year: number;

  @Column({ type: DataType.INTEGER })
  month: number;

  @Column({ type: DataType.INTEGER })
  date: Date;

  @Column({ type: DataType.NUMBER })
  flag_protected: number;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => UserEntity, 'userId')
  users?: UserEntity;

  @BelongsTo(() => DepartmentEntity, 'departmentId')
  department?: DepartmentEntity;

  @Column({ type: DataType.STRING })
  departmentId?: string;

  @Column({ type: DataType.DOUBLE })
  companyWillPayMoney?: number;

  salaryTotal?: number;
}
