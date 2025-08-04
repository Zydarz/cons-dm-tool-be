import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MasterDataDto } from '../../modules/master-data/dtos/master-data.dto';
import { NSLine } from './interfaces/line';

@ApiTags('Lines')
@Controller('lines')
export class LinesController {
  constructor(@Inject('ILineService') private readonly lineService: NSLine.ILineService) {}

  @Get()
  async getLines(): Promise<MasterDataDto[]> {
    return await this.lineService.getAll();
  }
}
