import { default as ProjectRankEntity } from '../../entities/project-rank.entity';
import { default as ContractTypeEntity } from '../../entities/contract-type.entity';
import { MasterDataRepository } from '../../repositories/masterdata.repository';
import { MasterDataService } from './master-data.service';
import { default as JobRankEntity } from '../../entities/job-rank.entity';
import { default as DailyReportActivitiesEntity } from '../../entities/daily-report-activities.entity';
import { forwardRef, Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { default as PositionEntity } from '../../entities/position.entity';
import { default as LineEntity } from '../../entities/line.entity';
import { default as DepartmentEntity } from '../../entities/department.entity';
import { DatabaseModule } from '../../database/database.module';
import { RoleModule } from '../../modules/roles/role.module';
import UserEntity from '../../entities/users.entity';
import projectEntity from '../../entities/project.entity';
import { default as SettingOtherCostEntity } from '../../entities/setting-other-cost.entity';

const providers = [
  {
    provide: 'IMasterDataService',
    useClass: MasterDataService,
  },
  {
    provide: 'IMasterDataRepository',
    useClass: MasterDataRepository,
  },
  {
    provide: ContractTypeEntity.name,
    useValue: ContractTypeEntity,
  },
  {
    provide: ProjectRankEntity.name,
    useValue: ProjectRankEntity,
  },
  {
    provide: JobRankEntity.name,
    useValue: JobRankEntity,
  },
  {
    provide: DailyReportActivitiesEntity.name,
    useValue: DailyReportActivitiesEntity,
  },
  {
    provide: PositionEntity.name,
    useValue: PositionEntity,
  },
  {
    provide: LineEntity.name,
    useValue: LineEntity,
  },
  {
    provide: DepartmentEntity.name,
    useValue: DepartmentEntity,
  },
  {
    provide: UserEntity.name,
    useValue: UserEntity,
  },
  {
    provide: projectEntity.name,
    useValue: projectEntity,
  },
  {
    provide: SettingOtherCostEntity.name,
    useValue: SettingOtherCostEntity,
  },
];

@Module({
  imports: [DatabaseModule, forwardRef(() => MasterDataModule), RoleModule],
  providers: [...providers],
  controllers: [MasterDataController],
  exports: [...providers],
})
export class MasterDataModule {}
