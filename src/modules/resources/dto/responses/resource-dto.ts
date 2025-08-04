import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserProjectDto } from '../../../../modules/user-projects/dto/responses/user-project-dto';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as ResourceEntity } from '../../../../entities/resource.entity';
import { MasterDataDto, ProjectRankDto } from '../../../../modules/master-data/dtos/master-data.dto';

export class ResourceDto extends AbstractDto {
  @ApiProperty()
  readonly userProjectId: number;

  @ApiPropertyOptional()
  readonly positionId?: number;

  @ApiPropertyOptional()
  readonly projectRankId?: number;

  @ApiProperty()
  readonly date: Date;

  @ApiPropertyOptional()
  readonly acPercent?: number;

  @ApiPropertyOptional()
  readonly tcPercent?: number;

  @ApiPropertyOptional()
  readonly note?: string;

  @ApiPropertyOptional()
  userProject?: UserProjectDto;

  @ApiPropertyOptional()
  projectRank?: ProjectRankDto;

  @ApiPropertyOptional()
  position?: MasterDataDto;

  constructor(resource: ResourceEntity) {
    super(resource);
    this.userProjectId = resource.userProjectId;
    this.positionId = resource.positionId;
    this.projectRankId = resource.projectRankId;
    this.date = resource.date;
    this.acPercent = resource.acPercent;
    this.tcPercent = resource.tcPercent;
    this.note = resource.note;
    this.userProject = resource.userProject?.toDto();
    this.projectRank = resource.projectRank?.toDto();
    this.position = resource.position?.toDto();
  }
}
