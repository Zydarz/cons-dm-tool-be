import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectNS } from '../../../../modules/projects/interfaces/project';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as ProjectEntity } from '../../../../entities/project.entity';
import { UserPostionResDto } from './user-position-res-dto';

export type UserResourceAllocatelDtoOptions = Partial<{ userAllocate: UserPostionResDto[] }>;

export class ProjectPositionResourceAllocateDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  type?: ProjectNS.Type;

  @ApiPropertyOptional()
  status?: ProjectNS.Status;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  internalPrice?: number;

  @ApiPropertyOptional()
  externalPrice?: number;

  @ApiPropertyOptional()
  allocates?: UserPostionResDto[];

  @ApiPropertyOptional()
  departmentId?: number;

  constructor(project: ProjectEntity, options?: UserResourceAllocatelDtoOptions) {
    super(project);
    this.name = project.name;
    this.code = project.code;
    this.type = project.type;
    this.status = project.status;
    this.startDate = project.startDate;
    this.endDate = project.endDate;
    this.internalPrice = project.internalPrice;
    this.externalPrice = project.externalPrice;
    this.departmentId = project.departmentId;
    this.allocates = options?.userAllocate;
  }
}
