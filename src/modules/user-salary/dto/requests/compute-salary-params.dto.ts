import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class ComputeSalaryParamsDto {

  @ApiProperty()
  @IsNumber()
  @Max(999999999999999)
  @Min(0)
  salaryGross: Number;

  @ApiProperty()
  @IsNumber()
  @Max(999999999999999)
  @Min(0)
  insuranceSalary: Number;

}
