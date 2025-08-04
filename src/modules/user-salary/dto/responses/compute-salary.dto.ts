import { ApiProperty } from '@nestjs/swagger';

export class ComputeSalaryDto {

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

}
