import { Sequelize } from 'sequelize-typescript';

import { ApiConfigService } from '../shared/services/api-config.service';

export const databaseProviders = [
  {
    provide: Sequelize.name,
    useFactory: async (configService: ApiConfigService): Promise<Sequelize> => configService.databaseConfig,
    inject: [ApiConfigService],
  },
];
