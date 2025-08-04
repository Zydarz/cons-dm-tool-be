import { Inject, Injectable } from '@nestjs/common';
import { MasterDataDto } from '../../modules/master-data/dtos/master-data.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PositionNS } from './interfaces/position';

@Injectable()
export class PositionsService implements PositionNS.IPositionService {
  constructor(@Inject('IPositionRepository') private readonly positionRepository: PositionNS.IPositionRepository) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<MasterDataDto>> {
    return await this.positionRepository.getAll(pageOptionsDto);
  }

  async getPosition(id: number): Promise<MasterDataDto> {
    return await this.positionRepository.getPosition(id);
  }

  async getPositionByCode(code: PositionNS.Code): Promise<MasterDataDto> {
    return await this.positionRepository.getPositionByCode(code);
  }
}
