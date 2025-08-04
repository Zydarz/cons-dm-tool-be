import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserNS } from '../../../../modules/users/interface/users';

export class CreateUserDto {
  @ApiProperty()
  @IsNumber()
  lineId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  jobRankId?: number;

  @ApiProperty()
  @IsNumber()
  departmentId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  employeeId?: string;

  @ApiProperty()
  @IsString()
  mail: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  displayName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  givenName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  surName: string;

  @ApiProperty()
  @IsEnum(UserNS.Status)
  status: UserNS.Status;

  @ApiProperty()
  @IsEnum(UserNS.Type)
  @IsOptional()
  type?: UserNS.Type;

  @ApiProperty()
  @IsEnum(UserNS.Roles)
  role: UserNS.Roles;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  roleId?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  flagOnsite: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  dependent?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bankId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bankAccountHolder?: string;
}
