import { Inject } from '@nestjs/common';
import { MasterDataDto } from '../../modules/master-data/dtos/master-data.dto';
import { NSLine } from './interfaces/line';

export class LinesService implements NSLine.ILineService {
  constructor(@Inject('ILineRepository') readonly lineRepository: NSLine.ILineRepository) {}

  getAll(): Promise<MasterDataDto[]> {
    return this.lineRepository.getAll();
  }
}
