import { Module } from '@nestjs/common';
import { default as UserProjectEntity } from '../../entities/user_project.entity';
import { UserProjectRepository } from '../../repositories/user-project.repository';
import { DatabaseModule } from '../../database/database.module';
import { UserProjectService } from './user-project.service';

export const providers = [
  {
    provide: 'IUserProjectService',
    useClass: UserProjectService,
  },
  {
    provide: 'IUserProjectRepository',
    useClass: UserProjectRepository,
  },
  {
    provide: UserProjectEntity.name,
    useValue: UserProjectEntity,
  },
];

@Module({
  imports: [DatabaseModule],
  providers: [...providers],
  exports: [...providers],
})
export class UserProjectModule {}
