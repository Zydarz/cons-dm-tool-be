import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as UserSalariesEntity } from 'entities/user-salaries.entity';
import { UserNS } from '../../../../modules/users/interface/users';

export class UserSalaryDto extends AbstractDto {

  @ApiProperty()
  userId: String;
  @ApiProperty()
  salary: Number;
  @ApiProperty()
  socialInsuranceSalary?: Number;
  @ApiPropertyOptional()
  dependent?: number;
  @ApiProperty()
  year: number;
  @ApiProperty()
  month: number;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  flag_protected: number;
  @ApiPropertyOptional()
  status?: UserNS.Status;
  @ApiProperty()
  departmentId?: string;

  constructor(userSalary: UserSalariesEntity) {
    super(userSalary);
    this.userId = userSalary.userId;
    this.salary = userSalary.salary;
    this.year = userSalary.year;
    this.month = userSalary.month;
    this.date = userSalary.date;
    this.flag_protected = userSalary.flag_protected;
    this.status = userSalary.status;
    this.departmentId = userSalary.departmentId;
    this.dependent = userSalary.dependent;
    this.socialInsuranceSalary = userSalary.socialInsuranceSalary;
  }
}
