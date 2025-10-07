import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TasksService } from './tasks.service';
import { TaskRepository } from '../../repositories/tasks.repository';
import { default as TaskEntity } from '../../entities/log-work.entity';
import { ResourceSummaryModule } from '../resource-summaries/resource-summary.module';
import { UserProjectModule } from '../user-projects/user-project.module';

const providers = [
  {
    provide: 'ITaskService',
    useClass: TasksService,
  },
  {
    provide: 'ITaskRepository',
    useClass: TaskRepository,
  },
  {
    provide: TaskEntity.name,
    useValue: TaskEntity,
  },
];
@Module({
  imports: [DatabaseModule, ResourceSummaryModule, UserProjectModule],
  providers: [...providers],
  exports: [...providers],
})
export class TasksModule {}
