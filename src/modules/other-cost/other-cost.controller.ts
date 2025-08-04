import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageDto } from '../../common/dto/page.dto';
import { Auth } from '../../decorators/http.decorators';
import { UserNS } from '../../modules/users/interface/users';
import { IOtherCostService } from './interface/other-cost.service.interface';
import { OtherCostDto } from './dto/responses/other-cost.dto';
import { CreateOtherCostDto } from './dto/requests/create-other-cost.dto';
import { UpdateOtherCostDto } from './dto/requests/update-other-cost.dto';
import { OtherCostFilterDto } from './dto/requests/other-cost-filter.dto';
import { SettingOtherCostUsingDto } from './dto/requests/setting-other-cost-using-dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { FullUpdateOtherCostDto } from './dto/requests/full-update-other-cost.dto';

@ApiTags('Other Cost')
@Controller('other-cost')
export class OtherCostController {
  constructor(@Inject('IOtherCostService') private readonly otherCostService: IOtherCostService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async getAll(
    @Query() params: OtherCostFilterDto,
  ): Promise<PageDto<OtherCostDto>> {
    return await this.otherCostService.getOtherCost(params);
  }

  @Get('setting-other-cost-using')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async getAllSettingOtherCostUsing(
  ): Promise<Number[]> {
    return await this.otherCostService.getSettingOtherCostUsing();
  }

  @Auth([UserNS.Roles.ADMIN])
  @Post()
  async createOtherCost(@Body() dto: CreateOtherCostDto) {
    return await this.otherCostService.createOtherCost(dto);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Put(':id')
  async updateOtherCost(@Param('id') id: number, @Body() dto: UpdateOtherCostDto): Promise<SuccessResponseDto> {
    return await this.otherCostService.updateOtherCost(id, dto);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Delete(':id')
  async deleteOtherCost(@Param('id') id: number): Promise<SuccessResponseDto> {
    return await this.otherCostService.deleteOtherCost(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/full-update')
  @Auth([UserNS.Roles.ADMIN])
  async fullUpdate(@Body() params: FullUpdateOtherCostDto): Promise<SuccessResponseDto> {
    return await this.otherCostService.fullUpdateOtherCost(params);
  }
}
