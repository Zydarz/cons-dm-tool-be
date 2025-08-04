import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ProjectDto } from '../../../../modules/projects/dto/responses/project-dto';
import { default as UserEntity } from '../../../../entities/users.entity';
import { UserNS } from '../../interface/users';
import {
  DepartmentDto,
  JobRankDto,
  LineDto,
  MasterDataDto,
} from '../../../../modules/master-data/dtos/master-data.dto';
import { PermissionMeDto } from '../../../../common/dto/permission.dto';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserSalaryPaggingDto } from '../../../../modules/user-salary/dto/responses/user-salary-paging.dto';

export class UserPaggingDto extends AbstractDto {
  @ApiProperty()
  employeeId: string;
  @ApiProperty()
  idGoogle?: string;
  @ApiPropertyOptional()
  lineId?: number;
  @ApiPropertyOptional()
  jobRankId?: number;
  @ApiPropertyOptional()
  departmentId?: number;
  @ApiPropertyOptional()
  bankId?: string;
  @ApiPropertyOptional()
  bankName?: string;
  @ApiPropertyOptional({ enum: [UserNS.Type.FULLTIMEC, UserNS.Type.FULLTIMET, UserNS.Type.INTERN, UserNS.Type.PARTTIME]})
  @IsString()
  type?: UserNS.Type;
  @ApiPropertyOptional()
  dependent?: number;
  @ApiPropertyOptional()
  socialInsuranceSalary?: number;
  @ApiPropertyOptional({ enum: [UserNS.PaymentType.CK, UserNS.PaymentType.TM]})
  @IsString()
  paymentType?: UserNS.PaymentType;
  @ApiProperty()
  mail: string;
  @ApiProperty()
  displayName: string;
  @ApiPropertyOptional()
  givenName?: string;
  @ApiPropertyOptional()
  surName?: string;
  @ApiPropertyOptional({ enum: [UserNS.Roles.ADMIN, UserNS.Roles.LOS, UserNS.Roles.MEMBER]})
  @IsString()
  role?: UserNS.Roles;
  @ApiProperty()
  roleId?: number;
  @ApiPropertyOptional()
  status?: UserNS.Status;
  @ApiPropertyOptional()
  username?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiPropertyOptional()
  permission?: PermissionMeDto[];
  @ApiProperty()
  line?: MasterDataDto;
  @ApiProperty()
  jobRank?: MasterDataDto;
  @ApiProperty()
  department?: MasterDataDto;
  @ApiProperty()
  lineName?: string;
  @ApiProperty()
  flagOnsite?: number;
  @ApiProperty()
  note?: string;
  @ApiPropertyOptional()
  project?: ProjectDto[];
  @ApiPropertyOptional()
  userSalaries?: UserSalaryPaggingDto[];

  constructor(
    entity: UserEntity,
    project?: ProjectDto[],
    line?: LineDto,
    jobRank?: JobRankDto,
    department?: DepartmentDto,
    permission?: PermissionMeDto[],
    userSalaries?: UserSalaryPaggingDto[],
  ) {
    super(entity);
    this.idGoogle = entity.idGoogle;
    this.mail = entity.mail;
    this.displayName = entity.displayName;
    this.givenName = entity.givenName;
    this.surName = entity.surName;
    this.role = entity.role;
    this.status = entity.status;
    this.type = entity.type;
    this.roleId = entity.roleId;
    this.username = entity.username;
    this.departmentId = entity.departmentId;
    this.dependent = entity.dependent;
    this.flagOnsite = entity.flagOnsite;
    this.note = entity.note;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.line = entity.line?.toDto() ?? line;
    this.jobRank = entity.jobRank?.toDto() ?? jobRank;
    this.lineName = entity.line?.name;
    this.department = entity.department?.toDto() ?? department;
    this.project = project;
    this.permission = permission;
    this.paymentType = entity?.paymentType;
    this.userSalaries = entity.userSalaries?.toDtos() ?? userSalaries;
    this.bankId = entity.bankId;
    this.bankName = entity.bankName;
    this.employeeId = entity.employeeId;
    this.socialInsuranceSalary = entity.socialInsuranceSalary;
  }
}
