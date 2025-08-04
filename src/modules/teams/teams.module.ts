import { Module } from '@nestjs/common';
import { TeamController } from './teams.controller';
import { AzureService } from '../../shared/services/azure.service';
import { TeamsService } from './teams.service';
import { TeamsRepository } from '../../repositories/teams.repository';
import { default as BotSettingEntity } from '../../entities/bot-setting.entity';
import { default as TeamLogsEntity } from '../../entities/team-logs.entity';
import { RoleModule } from '../../modules/roles/role.module';

const providers = [
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
];

const exportClass = [
  {
    provide: 'ITeamsService',
    useClass: TeamsService,
  },
];

@Module({
  imports: [RoleModule],
  exports: [...exportClass],
  providers: providers,
  controllers: [TeamController],
})
export class TeamsModule {}
