import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { default as ProjectEntity } from '../../../../entities/project.entity';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserProjectDto } from '../../../../modules/user-projects/dto/responses/user-project-dto';
import { ProjectNS } from '../../interfaces/project';
import { ResourceSummaryDto } from '../../../resource-summaries/dtos/resource-summary.dto';
import { UserDto } from '../../../../modules/users/dto/response/user-dto';
import { UserNS } from '../../../../modules/users/interface/users';
import { default as UserEntity } from '../../../../entities/users.entity';
import { ContractTypeDto, DepartmentDto } from '../../../master-data/dtos/master-data.dto';
import { CustomerDto } from '../../../customers/dto/responses/customer-dto';

export class ProjectDto extends AbstractDto {
  @ApiPropertyOptional()
  @IsOptional()
  customerId?: number;

  @ApiProperty()
  departmentId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  am?: string;

  @ApiPropertyOptional()
  pm?: string;

  @ApiPropertyOptional()
  type?: string;

  @ApiPropertyOptional()
  startDate: Date;

  @ApiPropertyOptional()
  endDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  startDateActual?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endDateActual?: Date;

  @ApiPropertyOptional()
  status: ProjectNS.Status;

  @ApiPropertyOptional()
  @IsOptional()
  internalPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  externalPrice?: number;

  @ApiPropertyOptional()
  userProjects?: UserProjectDto[];

  @ApiPropertyOptional()
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional()
  @IsOptional()
  billable?: number;

  @ApiPropertyOptional()
  currency: ProjectNS.Currency;

  @ApiPropertyOptional()
  actual?: number;

  @ApiPropertyOptional()
  calendarEffort?: number;

  @ApiPropertyOptional()
  noteSituation?: string;

  @ApiPropertyOptional()
  dateSituation?: Date;

  @ApiPropertyOptional()
  usernameSituation?: string;

  @ApiPropertyOptional()
  groupId?: string;

  @ApiPropertyOptional()
  channelId?: string;

  @ApiPropertyOptional({ type: () => ContractTypeDto })
  contractType?: ContractTypeDto;

  @ApiPropertyOptional({ type: () => DepartmentDto })
  department?: DepartmentDto;

  @ApiPropertyOptional({ type: () => [UserDto] })
  user?: UserDto[];

  @ApiPropertyOptional()
  customer?: CustomerDto;

  constructor(project: ProjectEntity, resourceSummary?: ResourceSummaryDto, user?: UserEntity[]) {
    super(project);
    this.customerId = project.customerId;
    this.departmentId = project.departmentId;
    this.name = project.name;
    this.code = project.code;
    this.pm = project.pm;
    this.am = project.am;
    this.customer = project.customer?.toDto();
    this.type = project.contractType?.name;
    this.contractType = project.contractType?.toDto();
    this.department = project.department?.toDto();
    this.startDate = project.startDate;
    this.endDate = project.endDate;
    this.startDateActual = project.startDateActual;
    this.endDateActual = project.endDateActual;
    this.status = project.status;
    this.internalPrice = project.internalPrice;
    this.externalPrice = project.externalPrice;
    this.userProjects = project.userProjects?.toDtos();
    this.budget = project.budget;
    this.billable = project.billable;
    this.currency = project.currency;
    this.actual = resourceSummary?.actual;
    this.user = UserNS.dtos.toUserDtos(user);
    this.channelId = project.botSetting?.channelId;
    this.groupId = project.botSetting?.groupId;
  }
}
