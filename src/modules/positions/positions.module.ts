import { Module } from '@nestjs/common';
import { default as PositionEntity } from '../../entities/position.entity';
import { DatabaseModule } from '../../database/database.module';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PositionsRepository } from '../../repositories/position.repository';
import { RoleModule } from '../../modules/roles/role.module';

const providers = [
  {
    provide: 'IPositionService',
    useClass: PositionsService,
  },
  {
    provide: 'IPositionRepository',
    useClass: PositionsRepository,
  },
  {
    provide: PositionEntity.name,
    useValue: PositionEntity,
  },
];
@Module({
  imports: [DatabaseModule, RoleModule],
  controllers: [PositionsController],
  providers: [...providers],
  exports: [...providers],
})
export class PositionsModule {}
