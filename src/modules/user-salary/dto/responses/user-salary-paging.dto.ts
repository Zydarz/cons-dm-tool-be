import { ResourceDto } from '../../../resources/dto/responses/resource-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as UserSalariesEntity } from 'entities/user-salaries.entity';
import { UserDto } from '../../../../modules/users/dto/response/user-dto';
import { default as UserEntity } from '../../../../entities/users.entity';
import { UserNS } from '../../../../modules/users/interface/users';
import { DepartmentDto } from '../../../../modules/master-data/dtos/master-data.dto';

export class UserSalaryPaggingDto extends AbstractDto {
  @ApiProperty()
  userId: String;
  @ApiProperty()
  name: String | undefined;
  @ApiProperty()
  userName: String | undefined;
  @ApiProperty()
  displayName: String | undefined;
  @ApiProperty()
  accountNumber: String | undefined;
  @ApiProperty()
  bankName: String | undefined;
  @ApiProperty()
  type: UserNS.Type | undefined;
  @ApiProperty()
  dependentPerson: Number;
  @ApiProperty()
  salaryGross: Number;
  @ApiProperty()
  insuranceSalary: Number;
  @ApiProperty()
  taxableSalary: Number;
  @ApiProperty()
  personalIncomeTaxParttime: Number;
  @ApiProperty()
  staffSocialInsurance: Number;
  @ApiProperty()
  staffHealthInsurance: Number;
  @ApiProperty()
  staffVoluntaryInsurance: Number;
  @ApiProperty()
  companySocialInsurance: Number;
  @ApiProperty()
  companyHealthInsurance: Number;
  @ApiProperty()
  companyVoluntaryInsurance: Number;
  @ApiProperty()
  personalIncomeTax: Number;
  @ApiProperty()
  salaryReceived: Number;
  @ApiProperty()
  retainedSalary: Number;
  @ApiProperty()
  companyWillPayMoney: Number;
  @ApiProperty()
  unaccountedCompanyMoney: Number;
  @ApiPropertyOptional({ enum: [UserNS.PaymentType.CK, UserNS.PaymentType.TM]})
  paymentType?: UserNS.PaymentType;
  @ApiProperty()
  salary: Number;
  @ApiProperty()
  year: number;
  @ApiProperty()
  month: number;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  flag_protected: number;
  @ApiProperty()
  divisionId: number | undefined;
  @ApiPropertyOptional({ type: () => UserDto })
  user?: UserDto;
  @ApiPropertyOptional()
  status?: UserNS.Status;
  @ApiProperty()
  departmentId?: string;
  @ApiPropertyOptional({ type: () => DepartmentDto })
  department?: DepartmentDto;

  constructor(userSalary: UserSalariesEntity) {
    super(userSalary);
    this.id = userSalary.userId;
    this.name = userSalary.users?.surName;
    this.userName = userSalary.users?.username;
    this.displayName = userSalary.users?.displayName;
    this.accountNumber = userSalary.bankId??userSalary.users?.bankId;
    this.divisionId = userSalary.users?.departmentId;
    this.bankName = userSalary.bankName??userSalary.users?.bankName;
    this.type = userSalary.type;
    this.dependentPerson = (userSalary.dependent)??0;
    this.salaryGross = userSalary.salary??0;
    this.insuranceSalary = userSalary.socialInsuranceSalary??0;
    this.taxableSalary = 0;
    this.personalIncomeTaxParttime = 0;
    this.staffSocialInsurance = 0;
    this.staffHealthInsurance = 0;
    this.staffVoluntaryInsurance = 0;
    this.companySocialInsurance = 0;
    this.companyHealthInsurance = 0;
    this.companyVoluntaryInsurance = 0;
    this.personalIncomeTax = 0;
    this.salaryReceived = 0;
    this.retainedSalary = 0;
    this.companyWillPayMoney = 0;
    this.unaccountedCompanyMoney = 0;
    this.paymentType = userSalary.paymentType;
    this.userId = userSalary.userId;
    this.year = userSalary.year;
    this.month = userSalary.month;
    this.date = userSalary.date;
    this.salary = userSalary.salary??0;
    this.status = userSalary.status??userSalary.users?.status;
    this.departmentId = userSalary.departmentId;
    this.department = userSalary?.department?.toDto();
  }
}
