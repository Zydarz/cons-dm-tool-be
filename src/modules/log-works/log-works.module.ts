import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LogWorksService } from './log-works.service';
import { LogWorkRepository } from '../../repositories/log-work.repository';
import { default as LogWorkEntity } from '../../entities/log-work.entity';
import { ResourceSummaryModule } from '../resource-summaries/resource-summary.module';
import { UserProjectModule } from '../user-projects/user-project.module';

const providers = [
  {
    provide: 'ILogWorkService',
    useClass: LogWorksService,
  },
  {
    provide: 'ILogWorkRepository',
    useClass: LogWorkRepository,
  },
  {
    provide: LogWorkEntity.name,
    useValue: LogWorkEntity,
  },
];
@Module({
  imports: [DatabaseModule, ResourceSummaryModule, UserProjectModule],
  providers: [...providers],
  exports: [...providers],
})
export class LogWorksModule {}
