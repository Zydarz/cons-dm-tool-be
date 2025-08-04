/* eslint-disable import/namespace */
import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleModule } from '../../modules/roles/role.module';
import { ResourcesModule } from '../../modules/resources/resources.module';
import { ResourcesService } from '../../modules/resources/resources.service';
import { DatabaseModule } from './../../database/database.module';

import { default as DaysOffEntity } from './../../entities/days-off.entity';
import { DaysOffRepository } from './../../repositories/days-off.repository';
import { DaysOffController } from './days-off.controller';
import { DaysOffService } from './days-off.service';
const providers = [
  {
    provide: 'IDaysOffService',
    useClass: DaysOffService,
  },
  {
    provide: 'IDaysOffRepository',
    useClass: DaysOffRepository,
  },
  {
    provide: DaysOffEntity.name,
    useValue: DaysOffEntity,
  },
  {
    provide: 'IResourceService',
    useClass: ResourcesService,
  },
];
@Module({
  imports: [DatabaseModule, forwardRef(() => ResourcesModule), RoleModule],
  controllers: [DaysOffController],
  providers: [DaysOffService, ...providers, JwtService],
  exports: [...providers],
})
export class DaysOffMoudule {}
