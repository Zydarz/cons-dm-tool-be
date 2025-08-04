import { forwardRef, Module } from '@nestjs/common';
import { ProjectsModule } from '../../modules/projects/projects.module';
import { DatabaseModule } from '../../database/database.module';
import { default as ProjectSituationEntity } from '../../entities/project-situation.entity';
import { ProjectSituationRepository } from '../../repositories/project-situation.repository';
import { ProjectSituationController } from './project-situation.controller';
import { ProjectSituationService } from './project-situation.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectSituationHistoryService } from '../project-situation-history/project-situation-history.service';
import { RoleModule } from '../../modules/roles/role.module';
import ProjectSituationHistoryEntity from '../../entities/project-situation-history.entity';
import { ProjectSituationHistoryModule } from '../../modules/project-situation-history/project-situation-history.module';

const providers = [
  {
    provide: 'IProjectSituationService',
    useClass: ProjectSituationService,
  },
  {
    provide: 'IProjectSituationRepository',
    useClass: ProjectSituationRepository,
  },
  {
    provide: ProjectSituationEntity.name,
    useValue: ProjectSituationEntity,
  },
  {
    provide: 'IProjectService',
    useClass: ProjectsService,
  },
  {
    provide: ProjectSituationHistoryEntity.name,
    useValue: ProjectSituationHistoryEntity,
  },
  {
    provide: 'IProjectSituationHistoryService',
    useClass: ProjectSituationHistoryService,
  },
];
@Module({
  imports: [DatabaseModule, forwardRef(() => ProjectsModule), forwardRef(() => ProjectSituationHistoryModule), RoleModule],
  controllers: [ProjectSituationController],
  providers: [...providers],
  exports: [...providers],
})
export class ProjectSituationsModule {}
