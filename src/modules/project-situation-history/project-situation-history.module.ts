import { forwardRef, Module } from '@nestjs/common';
import { ProjectsModule } from '../../modules/projects/projects.module';
import { DatabaseModule } from '../../database/database.module';
import { ProjectsService } from '../projects/projects.service';
import { RoleModule } from '../../modules/roles/role.module';
import { ProjectSituationHistoryService } from './project-situation-history.service';
import { default as ProjectSituationHistoryEntity } from '../../entities/project-situation-history.entity';
import { ProjectSituationHistoryController } from './project-situation-history.controller';
import ProjectSituationEntity from '../../entities/project-situation.entity';
import { ProjectSituationProjectRepository } from '../../repositories/project-situation-history.repository';

const providers = [
  {
    provide: 'IProjectSituationHistoryService',
    useClass: ProjectSituationHistoryService,
  },
  {
    provide: 'IProjectSituationHistoryRepository',
    useClass: ProjectSituationProjectRepository,
  },
  {
    provide: ProjectSituationHistoryEntity.name,
    useValue: ProjectSituationHistoryEntity,
  },
  {
    provide: ProjectSituationEntity.name,
    useValue: ProjectSituationEntity,
  },
  {
    provide: 'IProjectService',
    useClass: ProjectsService,
  },
];
@Module({
  imports: [DatabaseModule, forwardRef(() => ProjectsModule), RoleModule],
  controllers: [ProjectSituationHistoryController],
  providers: [...providers],
  exports: [...providers],
})
export class ProjectSituationHistoryModule {}
