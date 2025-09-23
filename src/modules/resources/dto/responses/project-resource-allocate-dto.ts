import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectNS } from '../../../../modules/projects/interfaces/project';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as ProjectEntity } from '../../../../entities/project.entity';
import { UserAllocateDto } from './user-allocate-dto';

export type UserResourceAllocatelDtoOptions = Partial<{ userAllocate: UserAllocateDto[] }>;

export class ProjectResourceAllocateDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  type?: string ;

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
  pm?: string;

  @ApiPropertyOptional()
  allocates?: UserAllocateDto[];

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
    this.allocates = options?.userAllocate;
  }
}
