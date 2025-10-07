import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CommentsService } from './comments.service';
import { CommentRepository } from '../../repositories/comments.repository';
import { default as CommentEntity } from '../../entities/log-work.entity';
import { ResourceSummaryModule } from '../resource-summaries/resource-summary.module';
import { UserProjectModule } from '../user-projects/user-project.module';

const providers = [
  {
    provide: 'ICommentService',
    useClass: CommentsService,
  },
  {
    provide: 'ICommentRepository',
    useClass: CommentRepository,
  },
  {
    provide: CommentEntity.name,
    useValue: CommentEntity,
  },
];
@Module({
  imports: [DatabaseModule, ResourceSummaryModule, UserProjectModule],
  providers: [...providers],
  exports: [...providers],
})
export class CommentsModule {}
