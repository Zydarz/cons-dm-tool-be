import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { default as JobRankEntity } from '../../../entities/job-rank.entity';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { default as ProjectRankEntity } from '../../../entities/project-rank.entity';
import { default as DailyReportActivitiesEntity } from '../../../entities/daily-report-activities.entity';
import { default as LineEntity } from '../../../entities/line.entity';
import { default as PositionEntity } from '../../../entities/position.entity';
import { default as ContractTypeEntity } from '../../../entities/contract-type.entity';
import { default as DepartmentEntity } from '../../../entities/department.entity';
import { default as SettingOtherCostEntity } from '../../../entities/setting-other-cost.entity';
import ProjectStatusBiddingEntity from 'entities/project-status-bidding.entity';
import ProjectStatusDevelopmentEntity from 'entities/project-status-development.entity';
import TaskStatusEntity from 'entities/task-status.entity';
import ProjectDomainEntity from 'entities/project-domain.entity';
import ProjectPriorityEntity from 'entities/project-priority.entity';

export class MasterDataDto extends AbstractDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  flag_protected?: number;

  @ApiProperty()
  @IsDateString()
  deletedAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;
}

export class LineDto extends MasterDataDto {
  constructor(entity: LineEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
    this.description = entity.description;
    this.flag_protected = entity.flag_protected;
  }
}

export class ContractTypeDto extends MasterDataDto {
  constructor(entity: ContractTypeEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
    this.deletedAt = entity.deletedAt;
  }
}

export class DailyReportActivitiesDto extends MasterDataDto {
  constructor(entity: DailyReportActivitiesEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
    this.deletedAt = entity.deletedAt;
  }
}

export class JobRankDto extends MasterDataDto {
  constructor(entity: JobRankEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
    this.deletedAt = entity.deletedAt;
  }
}

export class ProjectRankDto extends MasterDataDto {
  constructor(entity: ProjectRankEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
  }
}


export class ProjectStatusBiddingDto extends MasterDataDto {
  constructor(entity: ProjectStatusBiddingEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
  }
}

export class ProjectStatusDevelopmentDto extends MasterDataDto {
  constructor(entity: ProjectStatusDevelopmentEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
  }
}


export class TaskStatusDto extends MasterDataDto {
  constructor(entity: TaskStatusEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
  }
}

export class ProjectPriorityDto extends MasterDataDto {
  constructor(entity: ProjectPriorityEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
  }
}

export class ProjectDomainDto extends MasterDataDto {
  constructor(entity: ProjectDomainEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
  }
}



export class PositionDto extends MasterDataDto {
  constructor(entity: PositionEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
    this.code = entity.code;
    this.flag_protected = entity.flag_protected;
  }
}
export class DepartmentDto extends MasterDataDto {
  constructor(entity: DepartmentEntity) {
    super(entity);
    this.name = entity.name;
    this.flag_protected = entity.flag_protected;
  }
}

export class SettingOtherCostDto extends MasterDataDto {
  constructor(entity: SettingOtherCostEntity) {
    super(entity);
    this.name = entity.name;
    this.order = entity.order;
    this.flag_protected = entity.flag_protected;
  }
}
