import { Module } from '@nestjs/common';
import { default as LineEntity } from '../../entities/line.entity';
import { LineRepository } from '../../repositories/line.repository';
import { LinesController } from './lines.controller';
import { LinesService } from './lines.service';

const providers = [
  {
    provide: 'ILineService',
    useClass: LinesService,
  },
  {
    provide: 'ILineRepository',
    useClass: LineRepository,
  },
  {
    provide: LineEntity.name,
    useValue: LineEntity,
  },
];
@Module({
  providers: [...providers],
  controllers: [LinesController],
  exports: [...providers],
})
export class LineModule {}
