import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { default as ProjectEntity } from '../../../../entities/project.entity';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserProjectDto } from '../../../user-projects/dto/responses/user-project-dto';
import { ProjectNS } from '../../interfaces/project';
import { ResourceSummaryDto } from '../../../resource-summaries/dtos/resource-summary.dto';
import { UserDto } from '../../../users/dto/response/user-dto';
import { UserNS } from '../../../users/interface/users';
import { default as UserEntity } from '../../../../entities/users.entity';
import { ContractTypeDto, DepartmentDto } from '../../../master-data/dtos/master-data.dto';
import { CustomerDto } from '../../../customers/dto/responses/customer-dto';



export class TimeSheetProjectOfMemberDto extends AbstractDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  pm?: string;

  constructor(project: ProjectEntity) {
    super(project); // ✅ Khởi tạo id, createdAt, updatedAt
    this.name = project.name;
    this.code = project.code;
    this.pm = project.pm;
  }
}