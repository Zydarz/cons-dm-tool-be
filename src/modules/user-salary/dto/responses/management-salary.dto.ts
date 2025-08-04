import { ResourceDto } from './../../../resources/dto/responses/resource-dto';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as UserSalariesEntity } from 'entities/user-salaries.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ManagementSalaryDto {
  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  departmentId?: string;

  @ApiProperty()
  salaryTotal?: Number;
  constructor(year: number, month: number, date: Date, departmentId: string, salaryTotal: number) {
    this.year = year;
    this.month = month;
    this.date = date;
    this.departmentId = departmentId;
    this.salaryTotal = salaryTotal;
  }

}
