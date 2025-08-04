import { ApiProperty } from '@nestjs/swagger';

export class updatedByProjectDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  name?: string;

  // constructor(projectSituationEntity: ProjectSituationEntity) {
  //   super(projectSituationEntity);
  //   this.projectId = projectSituationEntity.projectId;
  //   this.name = String(projectSituationEntity.updatedAt);
  //   this.updatedAt = projectSituationEntity.updatedAt;
  // }
}
