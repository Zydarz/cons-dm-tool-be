import { Inject } from '@nestjs/common';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { default as PositionEntity } from '../entities/position.entity';
import { PositionNS } from '../modules/positions/interfaces/position';
import { isNil } from 'lodash';
import { MasterDataDto } from '../modules/master-data/dtos/master-data.dto';

export class PositionsRepository implements PositionNS.IPositionRepository {
  constructor(@Inject(PositionEntity.name) private readonly positionEntity: typeof PositionEntity) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<MasterDataDto>> {
    const condition = {};
    const [items, pageMetaDto] = await this.positionEntity.paginate(pageOptionsDto, condition);
    return items.sort().toPageDto(pageMetaDto);
  }

  async getPosition(id: number): Promise<MasterDataDto> {
    const doc = await this.positionEntity.findByPk(id);
    if (isNil(doc)) {
      throw PositionNS.errMsg.ErrNotFound;
    }
    return doc.toDto();
  }

  async getPositionByCode(code: PositionNS.Code): Promise<MasterDataDto> {
    const doc = await this.positionEntity.findOne({ where: { code } });
    if (isNil(doc)) {
      throw PositionNS.errMsg.ErrNotFound;
    }
    return doc.toDto();
  }
}
