import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SettingTemplateService } from './setting-template.service';
import { SettingTemplateRepository } from '../../repositories/setting-template.repository';
import { default as SettingTemplateEntity } from '../../entities/setting_template.entity';
import { SettingTemplateController } from './setting-template.controller';
import { RoleService } from '../../modules/roles/role.service';
import { RoleModule } from '../../modules/roles/role.module';
const providers = [
  {
    provide: 'ISettingTemplateService',
    useClass: SettingTemplateService,
  },
  {
    provide: 'ISettingTemplateRepository',
    useClass: SettingTemplateRepository,
  },
  {
    provide: 'SettingTemplateEntity',
    useValue: SettingTemplateEntity,
  },
  {
    provide: 'IRoleService',
    useClass: RoleService,
  },
];
@Module({
  imports: [DatabaseModule, RoleModule],
  controllers: [SettingTemplateController],
  providers: [...providers],
  exports: [...providers],
})
export class SettingTemplateModule {}
