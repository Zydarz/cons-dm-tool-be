/* eslint-disable @typescript-eslint/no-namespace */
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { NotFoundException } from '@nestjs/common';
import { default as PaymentEntity } from '../../../entities/payment-tracking.entity';
import { UpdatePaymentDto } from '../dto/requests/update-payment-tracking.dto';
import { CreatePaymentDto } from '../dto/requests/create-payment-tracking.dto';
import { PaymentResDto } from '../../../common/dto/payment.response.dto';
import { PaymentFilterOptionsDto } from '../dto/requests/payment-filter-options.dto';
import { PaymentDto } from '../dto/responses/payment-dto';
import { PaymentSummaryFilterDto } from '../dto/requests/payment-summary-filter.dto';
import { PaymentSummaryAllDto } from '../dto/responses/payment-summary-all.dto';
import { PaymentSummaryGraphicAllDto } from '../dto/responses/payment-summary-graphic-all.dto';
import { default as UserEntity } from '../../../entities/users.entity';
import { Transaction } from 'sequelize';
export namespace PaymentNS {
  export enum Status {
    ALL = 'All',
    NEW = 'New',
    PENDING = 'Pending',
    PAID = 'Paid',
    CANCELLED = 'Cancelled',
    PROCESSING = 'Processing',
  }
  export enum Type {
    MONTH = 'month',
    YEAR = 'year',
    PROJECTID = 'projectId',
  }
  export interface IPaymentTrackingService {
    getAll(projectId: number): Promise<PaymentResDto>;
    getFilter(param: PaymentFilterOptionsDto): Promise<PaymentDto[]>;
    updatePayment(id: number, update: UpdatePaymentDto, user: UserEntity): Promise<PaymentDto>;
    createPayment(param: CreatePaymentDto, user: UserEntity): Promise<PaymentDto>;
    deletePayment(id: number, user: UserEntity): Promise<SuccessResponseDto>;
    filterPaymentSummmay(filter: PaymentSummaryFilterDto, user: UserEntity): Promise<PaymentSummaryAllDto>;
    filterPaymentSummmayGraphic(filter: PaymentSummaryFilterDto, user: UserEntity): Promise<PaymentSummaryGraphicAllDto>;
    deletePaymentByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getTotalPaymentByProjectId(projectId: number, status: PaymentNS.Status): Promise<number>;
    checkPaymentExists(param: CreatePaymentDto): Promise<SuccessResponseDto>;
  }
  export interface IPaymentTrackingRepository {
    findById(id: number): Promise<PaymentEntity>;
    getAll(projectId: number): Promise<PaymentResDto>;
    getFilter(param: PaymentFilterOptionsDto): Promise<PaymentDto[]>;
    updatePayment(id: number, update: UpdatePaymentDto): Promise<PaymentEntity>;
    createPayment(param: CreatePaymentDto): Promise<PaymentEntity>;
    deletePayment(id: number): Promise<SuccessResponseDto>;
    getArrayFilterSummary(filter: PaymentSummaryFilterDto, condition: any, conditionRelation: any, user: UserEntity);
    getArrayFilterSummaryGraphic(filter: PaymentSummaryFilterDto, condition: any, conditionRelation: any, user: UserEntity);
    getPaymentSummary(condition: any, conditionRelation: any, user: UserEntity): Promise<PaymentEntity[]>;
    getFilterPaymentSummary(condition: any, conditionRelation: any, user: UserEntity): Promise<PaymentDto[]>;
    deletePaymentByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getTotalPaymentByProjectId(projectId: number, status: PaymentNS.Status): Promise<number>;
    checkPaymentExists(param: CreatePaymentDto): Promise<SuccessResponseDto>;
  }
  export const errMsg = {
    PaymentNotFound: new NotFoundException('Not Found'),
  };
}
