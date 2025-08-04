import { Controller, Inject, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { PaymentNS } from './interfaces/payment-tracking';
import { UpdatePaymentDto } from './dto/requests/update-payment-tracking.dto';
import { CreatePaymentDto } from './dto/requests/create-payment-tracking.dto';
import { PaymentResDto } from '../../common/dto/payment.response.dto';
import { PaymentFilterOptionsDto } from './dto/requests/payment-filter-options.dto';
import { PaymentDto } from './dto/responses/payment-dto';
import { PaymentSummaryFilterDto } from './dto/requests/payment-summary-filter.dto';
import { PaymentSummaryAllDto } from './dto/responses/payment-summary-all.dto';
import { UserNS } from '../../modules/users/interface/users';
import { Auth } from '../../decorators/http.decorators';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';
import { PaymentSummaryGraphicAllDto } from './dto/responses/payment-summary-graphic-all.dto';
@ApiTags('PaymentTracking')
@Controller('payment_tracking')
export class PaymentTrackingController {
  constructor(
    @Inject('IPaymentTrackingService')
    private readonly paymentTrackingService: PaymentNS.IPaymentTrackingService,
  ) {}

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  async paymentSummary(
    @Query() filter: PaymentSummaryFilterDto,
    @AuthUser() user: UserEntity,
  ): Promise<PaymentSummaryAllDto> {
    return await this.paymentTrackingService.filterPaymentSummmay(filter, user);
  }

  @Get('summary_graphic')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  async paymentSummaryGraphic(
    @Query() filter: PaymentSummaryFilterDto,
    @AuthUser() user: UserEntity,
  ): Promise<PaymentSummaryGraphicAllDto> {
    return await this.paymentTrackingService.filterPaymentSummmayGraphic(filter, user);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  async getFilter(@Query() params: PaymentFilterOptionsDto): Promise<PaymentDto[]> {
    return await this.paymentTrackingService.getFilter(params);
  }

  @Get('/:projectId')
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  @HttpCode(HttpStatus.OK)
  async getAll(@Param('projectId') projectId: number): Promise<PaymentResDto> {
    return await this.paymentTrackingService.getAll(projectId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  async createPayment(@Body() params: CreatePaymentDto, @AuthUser() user: UserEntity): Promise<PaymentDto> {
    return await this.paymentTrackingService.createPayment(params, user);
  }

  @Post('/check-payment-exists')
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  @HttpCode(HttpStatus.OK)
  async checkPaymentExists(@Body() params: CreatePaymentDto): Promise<SuccessResponseDto> {
    return await this.paymentTrackingService.checkPaymentExists(params);
  }

  @Put('/:id')
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  @HttpCode(HttpStatus.OK)
  async updatePayment(
    @Param('id') id: number,
    @Body() params: UpdatePaymentDto,
    @AuthUser() user: UserEntity,
  ): Promise<PaymentDto> {
    return await this.paymentTrackingService.updatePayment(id, params, user);
  }

  @Delete('/:id')
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  @HttpCode(HttpStatus.OK)
  async destroyPayment(@Param('id') id: number, @AuthUser() user: UserEntity): Promise<SuccessResponseDto> {
    return await this.paymentTrackingService.deletePayment(id, user);
  }
}
