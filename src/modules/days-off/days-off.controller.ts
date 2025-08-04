import { Controller, Get, HttpCode, HttpStatus, Inject, Body, Post, Put, Delete, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { UserNS } from '../../modules/users/interface/users';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateDaysOffDto } from './dto/request/param-create-dto';
import { UpdateDaysOffDto } from './dto/request/param-update-dto';
import { DaysOffDto } from './dto/response/days-off-dto';
import { DaysOffNS } from './interface/days-off.interface';
@ApiTags('Days-Off')
@Controller('days-off')
export class DaysOffController {
  constructor(
    @Inject('IDaysOffService')
    private readonly daysoffService: DaysOffNS.IDaysOffService,
  ) {}

  @Get()
  @Auth([UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.OK)
  async getAll(@Query('year') year?: string): Promise<DaysOffDto[]> {
    if (!year) {
      year = `${new Date().getFullYear()}`;
    }
    return await this.daysoffService.getDaysOff(year);
  }

  @Post()
  @Auth([UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() param: CreateDaysOffDto): Promise<SuccessResponseDto> {
    return await this.daysoffService.create(param);
  }

  @Put(':id')
  @Auth([UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() param: UpdateDaysOffDto): Promise<SuccessResponseDto> {
    return await this.daysoffService.update(param, id);
  }

  @Delete(':id')
  @Auth([UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<SuccessResponseDto> {
    return await this.daysoffService.delete(id);
  }
}
