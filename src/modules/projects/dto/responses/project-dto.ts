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
import { ContractTypeDto, DepartmentDto, MasterDataDto } from '../../../master-data/dtos/master-data.dto';
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
  @IsOptional()
  billable?: number;

  @ApiPropertyOptional()
  userProjects?: UserProjectDto[];

  @ApiPropertyOptional()
  @IsOptional()
  budget?: number;

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

  // Các trường mới được thêm trước đó
  @ApiPropertyOptional()
  @IsOptional()
  backLogId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  techStack?: string;

  @ApiPropertyOptional()
  @IsOptional()
  market?: string;

  @ApiPropertyOptional()
  @IsOptional()
  statusBidding?: number;

  @ApiPropertyOptional()
  @IsOptional()
  statusDevelopment?: number;

  // 3 trường dữ liệu mới được bổ xung
  @ApiPropertyOptional()
  @IsOptional()
  application?: string;

  @ApiPropertyOptional()
  @IsOptional()
  budgetCustomer?: number;

  @ApiPropertyOptional()
  @IsOptional()
  feedbackDate?: Date;

  // 5 trường mới cần bổ sung
  @ApiPropertyOptional()
  @IsOptional()
  wbsLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  departmentIds?: string;

  @ApiPropertyOptional()
  @IsOptional()
  winRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  domains?: string;

  @ApiPropertyOptional()
  @IsOptional()
  priority?: number;

  // Existing relationships
  @ApiPropertyOptional({ type: () => ContractTypeDto })
  contractType?: ContractTypeDto;

  @ApiPropertyOptional({ type: () => DepartmentDto })
  department?: DepartmentDto;

  @ApiPropertyOptional({ type: () => [UserDto] })
  user?: UserDto[];

  @ApiPropertyOptional()
  customer?: CustomerDto;

  // Thêm relationships mới cho status bidding và development
  @ApiPropertyOptional({ type: () => MasterDataDto })
  projectStatusBidding?: MasterDataDto;

  @ApiPropertyOptional({ type: () => MasterDataDto })
  projectStatusDevelopment?: MasterDataDto;

  @ApiPropertyOptional({ type: () => MasterDataDto })
  projectPriority?: MasterDataDto;

  @ApiPropertyOptional({ type: () => [MasterDataDto] })
  projectDomains?: MasterDataDto[];

  @ApiPropertyOptional({ type: () => [DepartmentDto] })
  projectDepartments?: DepartmentDto[];

  constructor(project: ProjectEntity, resourceSummary?: ResourceSummaryDto, user?: UserEntity[]) {
    super(project);

    this.customerId = project.customerId;
    this.departmentId = project.departmentId;
    this.name = project.name;
    this.code = project.code;
    this.pm = project.pm;
    this.am = project.am;
    this.customer = project.customer?.toDto();
    this.type = project.type;
    this.contractType = project.contractType?.toDto();
    this.department = project.department?.toDto();
    this.startDate = project.startDate;
    this.endDate = project.endDate;
    this.startDateActual = project.startDateActual;
    this.endDateActual = project.endDateActual;
    this.status = project.status;
    this.internalPrice = project.internalPrice;
    this.externalPrice = project.externalPrice;
    this.billable = project.billable;
    this.userProjects = project.userProjects?.toDtos();
    this.budget = project.budget;
    this.currency = project.currency;
    this.actual = resourceSummary?.actual;
    this.user = UserNS.dtos.toUserDtos(user);
    this.channelId = project.botSetting?.channelId;
    this.groupId = project.botSetting?.groupId;

    // Gán giá trị cho các trường mới được thêm trước đó
    this.backLogId = project.backLogId;
    this.techStack = project.techStack;
    this.market = project.market;
    this.statusBidding = project.statusBidding;
    this.statusDevelopment = project.statusDevelopment;

    // Gán giá trị cho 3 trường dữ liệu mới được bổ xung
    this.application = project.application;
    this.budgetCustomer = project.budgetCustomer;
    this.feedbackDate = project.feedbackDate;

    // Gán giá trị cho 5 trường mới cần bổ sung
    this.wbsLink = project.wbsLink;
    this.departmentIds = project.departmentIds;
    this.winRate = project.winRate != null ? Number(project.winRate) : undefined;

  //  this.winRate = project.winRate;
    this.domains = project.domains;
    this.priority = project.priority;




    // Gán giá trị cho relationships mới
    this.projectStatusBidding = project.projectStatusBidding?.toDto();
    this.projectStatusDevelopment = project.projectStatusDevelopment?.toDto();
    this.projectPriority = project.projectPriority?.toDto();



  }
}