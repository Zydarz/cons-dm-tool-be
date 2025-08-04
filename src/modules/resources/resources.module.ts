/* eslint-disable import/namespace */
import { forwardRef, Module } from '@nestjs/common';
import { default as ResourceEntity } from '../../entities/resource.entity';
import { ResourceRepository } from '../../repositories/resource.repository';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { SharedModule } from '../../shared/shared.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../../modules/users/users.service';
import { UserProjectService } from '../../modules/user-projects/user-project.service';
import { ProjectsService } from '../../modules/projects/projects.service';
import { LogWorksService } from '../../modules/log-works/log-works.service';
import { UserProjectModule } from '../../modules/user-projects/user-project.module';
import { LogWorksModule } from '../../modules/log-works/log-works.module';
import { ProjectsModule } from '../../modules/projects/projects.module';
import { UsersRepository } from '../../repositories/users.repository';
import { default as UserEntity } from '../../entities/users.entity';
import { ResourceSummaryModule } from '../../modules/resource-summaries/resource-summary.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { PositionsService } from '../../modules/positions/positions.service';
import { AzureService } from '../../shared/services/azure.service';
import { DaysOffRepository } from '../../repositories/days-off.repository';
import { DaysOffMoudule } from '../../modules/days-off/days-off.module';
import { DatabaseModule } from '../../database/database.module';
import { TeamsModule } from '../../modules/teams/teams.module';
import { TeamsService } from '../../modules/teams/teams.service';
import { TeamsRepository } from '../../repositories/teams.repository';
import { default as BotSettingEntity } from '../../entities/bot-setting.entity';
import { default as TeamLogsEntity } from '../../entities/team-logs.entity';
import { ResourceSummaryService } from '../../modules/resource-summaries/resource-summary.service';
import { PermissionService } from '../../modules/permission/permission.service';
import { PermissionModule } from '../../modules/permission/permission.module';
import { RoleModule } from '../../modules/roles/role.module';
import DepartmentEntity from '../../entities/department.entity';
import { MasterDataService } from '../../modules/master-data/master-data.service';
import { MasterDataModule } from '../../modules/master-data/master-data.module';
import { UserSalaryModule } from '../../modules/user-salary/user-salary.module';
import UserSalariesEntity from '../../entities/user-salaries.entity';
import { OtherCostModule } from '../../modules/other-cost/other-cost.module';
import { OtherCostService } from '../../modules/other-cost/other-cost.service';
import { OtherCostRepository } from '../../repositories/other-cost.repository';
const providers = [
  {
    provide: 'IResourceService',
    useClass: ResourcesService,
  },
  {
    provide: 'IResourceRepository',
    useClass: ResourceRepository,
  },
  {
    provide: ResourceEntity.name,
    useValue: ResourceEntity,
  },
  {
    provide: 'IUserProjectService',
    useClass: UserProjectService,
  },
  {
    provide: 'IResourceSummaryService',
    useClass: ResourceSummaryService,
  },
  {
    provide: 'IUserService',
    useClass: UserService,
  },
  {
    provide: 'IUserRepository',
    useClass: UsersRepository,
  },
  {
    provide: UserEntity.name,
    useValue: UserEntity,
  },
  {
    provide: 'ILogWorkService',
    useClass: LogWorksService,
  },
  {
    provide: 'IProjectService',
    useClass: ProjectsService,
  },
  {
    provide: 'IPositionService',
    useClass: PositionsService,
  },
  {
    provide: 'IDaysOffRepository',
    useClass: DaysOffRepository,
  },
  {
    provide: AzureService.name,
    useClass: AzureService,
  },
  {
    provide: 'ITeamsService',
    useClass: TeamsService,
  },
  {
    provide: 'ITeamsRepository',
    useClass: TeamsRepository,
  },
  {
    provide: BotSettingEntity.name,
    useValue: BotSettingEntity,
  },
  {
    provide: TeamLogsEntity.name,
    useValue: TeamLogsEntity,
  },
  {
    provide: 'IPermissionService',
    useClass: PermissionService,
  },
  {
    provide: DepartmentEntity.name,
    useValue: DepartmentEntity,
  },
  {
    provide: 'IMasterDataService',
    useClass: MasterDataService,
  },
  {
    provide: 'UserSalariesEntity',
    useValue: UserSalariesEntity,
  },
  {
    provide: 'IOtherCostService',
    useClass: OtherCostService,
  },
  {
    provide: 'IOtherCostRepository',
    useClass: OtherCostRepository,
  },
];
@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    UserProjectModule,
    LogWorksModule,
    ResourceSummaryModule,
    PositionsModule,
    TeamsModule,
    DaysOffMoudule,
    PermissionModule,
    RoleModule,
    forwardRef(() => MasterDataModule),
    forwardRef(() => OtherCostModule),
    // forwardRef(() => DaysOffMoudule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => UserSalaryModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.jwtSecret,
        signOptions: {
          expiresIn: configService.authConfig.jwtExpirationTime,
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [ResourcesController],
  providers: [...providers],
  exports: [...providers],
})
export class ResourcesModule {}
