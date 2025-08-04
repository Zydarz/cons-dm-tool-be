/* eslint-disable import/namespace */
import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from '../../modules/projects/projects.service';
import { DatabaseModule } from '../../database/database.module';
import { default as ResourceSummaryEntity } from '../../entities/resource-summary.entity';
import { ResourceSummaryRepository } from '../../repositories/resource-summary.repository';
import { ResourceSummaryController } from './resource-summary.controller';
import { ResourceSummaryService } from './resource-summary.service';
import { ProjectsModule } from '../../modules/projects/projects.module';
import { RoleModule } from '../../modules/roles/role.module';

const providers = [
  {
    provide: 'IResourceSummaryService',
    useClass: ResourceSummaryService,
  },
  {
    provide: 'IResourceSummaryRepository',
    useClass: ResourceSummaryRepository,
  },
  {
    provide: ResourceSummaryEntity.name,
    useValue: ResourceSummaryEntity,
  },
  {
    provide: 'IProjectService',
    useClass: ProjectsService,
  },
];

@Module({
  imports: [DatabaseModule, forwardRef(() => ProjectsModule), RoleModule],
  controllers: [ResourceSummaryController],
  providers: [...providers],
  exports: [...providers],
})
export class ResourceSummaryModule {}
