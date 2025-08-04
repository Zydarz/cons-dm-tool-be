import { forwardRef, Module } from '@nestjs/common';
import { ProjectRepository } from '../../repositories/project.repository';
import { DatabaseModule } from '../../database/database.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { default as ProjectEntity } from '../../entities/project.entity';
import { UserProjectService } from '../../modules/user-projects/user-project.service';
import { LogWorksService } from '../../modules/log-works/log-works.service';
import { LogWorksModule } from '../../modules/log-works/log-works.module';
import { UserProjectModule } from '../../modules/user-projects/user-project.module';
import { ResourceSummaryService } from '../../modules/resource-summaries/resource-summary.service';
import { ResourceSummaryModule } from '../../modules/resource-summaries/resource-summary.module';
import { CustomersService } from '../../modules/customers/customers.service';
import { CustomersModule } from '../../modules/customers/customers.module';
import { UserService } from './../../modules/users/users.service';
import { ResourcesService } from './../../modules/resources/resources.service';
import { ResourceRepository } from '../../repositories/resource.repository';
import { UserModule } from './../users/users.module';
import { ResourcesModule } from './../resources/resources.module';
import { JwtService } from '@nestjs/jwt';
import { ProjectSituationService } from '../../modules/project-situations/project-situation.service';
import { ProjectSituationsModule } from '../../modules/project-situations/project-situation.module';
import { TeamsModule } from '../../modules/teams/teams.module';
import { TeamsService } from '../../modules/teams/teams.service';
import { PaymentTrackingService } from '../../modules/payment-tracking/payment-tracking.service';
import { PaymentTrackingModule } from '../../modules/payment-tracking/payment-tracking.module';
import { MasterDataService } from '../../modules/master-data/master-data.service';
import { MasterDataModule } from '../../modules/master-data/master-data.module';
import { DaysOffService } from '../../modules/days-off/days-off.service';
import { DaysOffMoudule } from '../../modules/days-off/days-off.module';
import { UserSalaryRepository } from '../../repositories/user-salary.repository';
const providers = [
  {
    provide: 'IProjectService',
    useClass: ProjectsService,
  },
  {
    provide: 'IProjectRepository',
    useClass: ProjectRepository,
  },
  {
    provide: ProjectEntity.name,
    useValue: ProjectEntity,
  },
  {
    provide: 'ICustomerService',
    useClass: CustomersService,
  },
  {
    provide: 'IProjectSituationService',
    useClass: ProjectSituationService,
  },
  {
    provide: 'IUserService',
    useClass: UserService,
  },
  {
    provide: 'IResourceService',
    useClass: ResourcesService,
  },
  {
    provide: 'IUserProjectService',
    useClass: UserProjectService,
  },
  {
    provide: 'ILogWorkService',
    useClass: LogWorksService,
  },
  {
    provide: 'IResourceSummaryService',
    useClass: ResourceSummaryService,
  },
  {
    provide: 'ITeamsService',
    useClass: TeamsService,
  },
  {
    provide: 'IMasterDataService',
    useClass: MasterDataService,
  },
  {
    provide: 'IPaymentTrackingService',
    useClass: PaymentTrackingService,
  },
  {
    provide: 'IDaysOffService',
    useClass: DaysOffService,
  },
  {
    provide: 'IResourceRepository',
    useClass: ResourceRepository,
  },
  {
    provide: 'IUserSalaryRepository',
    useClass: UserSalaryRepository,
  },
];

@Module({
  imports: [
    DatabaseModule,
    CustomersModule,
    LogWorksModule,
    PaymentTrackingModule,
    MasterDataModule,
    UserModule,
    forwardRef(() => ResourcesModule),
    UserProjectModule,
    ResourceSummaryModule,
    forwardRef(() => ProjectSituationsModule),
    TeamsModule,
  ],
  controllers: [ProjectsController],
  providers: [...providers, JwtService],
  exports: [...providers],
})
export class ProjectsModule {}
