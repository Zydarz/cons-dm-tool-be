import { Inject } from '@nestjs/common';
import { NSLine } from '../modules/lines/interfaces/line';
import { default as LineEntity } from '../entities/line.entity';
import { MasterDataDto } from '../modules/master-data/dtos/master-data.dto';

export class LineRepository implements NSLine.ILineRepository {
  constructor(@Inject(LineEntity.name) private readonly lineEntity: typeof LineEntity) {}

  async getAll(): Promise<MasterDataDto[]> {
    const listLineEntity = await this.lineEntity.findAll();
    return listLineEntity.toDtos();
  }
}
