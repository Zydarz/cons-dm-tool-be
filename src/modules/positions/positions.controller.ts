import { Controller, Get, HttpCode, HttpStatus, Inject, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PositionNS } from './interfaces/position';
import { UserNS } from '../../modules/users/interface/users';
import { MasterDataDto } from '../../modules/master-data/dtos/master-data.dto';

@ApiTags('Position')
@Controller('positions')
export class PositionsController {
  constructor(@Inject('IPositionService') private readonly positionService: PositionNS.IPositionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getAll(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<MasterDataDto>> {
    return await this.positionService.getAll(pageOptionsDto);
  }
}
