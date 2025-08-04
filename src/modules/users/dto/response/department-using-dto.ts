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
import ProjectEntity from 'entities/project.entity';

export class DepartmentUsingDto {
  @ApiPropertyOptional()
  departmentId?: number;


  constructor(
    entity: UserEntity | ProjectEntity,
  ) {
    this.departmentId = entity.departmentId;
  }
}
