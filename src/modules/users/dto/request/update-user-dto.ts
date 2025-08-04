import { IsNumber, IsOptional, IsEnum, IsString, IsArray, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserNS } from '../../../../modules/users/interface/users';
import { DetailUpdateSalaryDto } from './detail-update-salary-dto';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  lineId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  jobRankId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  roleId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  givenName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  surName?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserNS.Roles)
  role: UserNS.Roles;

  @ApiPropertyOptional()
  @IsEnum(UserNS.Status)
  @IsOptional()
  status?: UserNS.Status;

  @ApiPropertyOptional()
  @IsEnum(UserNS.Type)
  @IsOptional()
  type?: UserNS.Type;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  flagOnsite?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  dependent?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankAccountHolder?: string;

  @ApiPropertyOptional({ type: [DetailUpdateSalaryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailUpdateSalaryDto)
  @IsOptional()
  salaries?: DetailUpdateSalaryDto[];
}
