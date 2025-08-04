import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import _, { isNil } from 'lodash';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { PaymentNS } from './interfaces/payment-tracking';
import { UpdatePaymentDto } from './dto/requests/update-payment-tracking.dto';
import { CreatePaymentDto } from './dto/requests/create-payment-tracking.dto';
import { PaymentResDto } from '../../common/dto/payment.response.dto';
import { PaymentFilterOptionsDto } from './dto/requests/payment-filter-options.dto';
import { PaymentDto } from './dto/responses/payment-dto';
import { PaymentSummaryFilterDto } from './dto/requests/payment-summary-filter.dto';
import { GroupBy } from '../../common/constants/group-by';
import { PaymentSummaryAllDto } from './dto/responses/payment-summary-all.dto';
import { PaymentSummaryGraphicAllDto } from './dto/responses/payment-summary-graphic-all.dto';
import { ProjectNS } from '../../modules/projects/interfaces/project';
import { Op, Sequelize, Transaction } from 'sequelize';
import { TotalSummaryDto } from './dto/responses/summary.dto';
import { PaymentSummaryDto } from './dto/responses/payment-summary-month.dto';
import { PaymentSummaryGraphicMonthDto } from './dto/responses/payment-summary-graphic-month.dto';
import { TotalEffortDto } from './dto/responses/total-effort-dto';
import { TotalEffortGraphicDto } from './dto/responses/total-effort-graphic-dto';
import moment from 'moment-timezone';
import { default as UserEntity } from '../../entities/users.entity';
import { UserNS } from '../../modules/users/interface/users';
import { TotalSummaryGraphicDto } from './dto/responses/summary-graphic.dto';

@Injectable()
export class PaymentTrackingService implements PaymentNS.IPaymentTrackingService {
  constructor(
    @Inject('IPaymentTrackingRepository')
    private readonly paymentTrackingRepository: PaymentNS.IPaymentTrackingRepository,
    @Inject('IProjectService')
    private readonly projectService: ProjectNS.IProjectService,
  ) {}

  async getAll(projectId: number): Promise<PaymentResDto> {
    return await this.paymentTrackingRepository.getAll(projectId);
  }

  async getFilter(params: PaymentFilterOptionsDto): Promise<PaymentDto[]> {
    return await this.paymentTrackingRepository.getFilter(params);
  }

  async updatePayment(id: number, params: UpdatePaymentDto, user: UserEntity): Promise<PaymentDto> {
    const payment = await this.paymentTrackingRepository.findById(id);
    const isPm = await this.projectService.isProjectManager(payment.projectId, user.id);

    const projectDetails = await this.projectService.detailProject2(payment.projectId);

    if (projectDetails.status === 'Bidding' && params.status !== 'New') {
      throw new ForbiddenException("Payment Status is not 'NEW'. Plese select Status 'NEW'");
    }
    if (user.role === UserNS.Roles.ADMIN || isPm) {
      const payment = await this.paymentTrackingRepository.updatePayment(id, params);
      return payment.toDto();
    }
    throw new ForbiddenException();
  }

  async createPayment(params: CreatePaymentDto, user: UserEntity): Promise<PaymentDto> {
    const isPm = await this.projectService.isProjectManager(params.projectId, user.id);

    const projectDetails = await this.projectService.detailProject2(params.projectId);

    if (projectDetails.status === 'Bidding' && params.status !== 'New') {
      throw new ForbiddenException("Payment Status is not 'NEW'. Plese select Status 'NEW'");
    }
    if (user.role === UserNS.Roles.ADMIN || isPm) {
      const payment = await this.paymentTrackingRepository.createPayment(params);
      return payment.toDto();
    }
    throw new ForbiddenException();
  }

  async deletePayment(id: number, user: UserEntity): Promise<SuccessResponseDto> {
    const payment = await this.paymentTrackingRepository.findById(id);
    const isPm = await this.projectService.isProjectManager(payment.projectId, user.id);

    if (user.role === UserNS.Roles.ADMIN || isPm) {
      return await this.paymentTrackingRepository.deletePayment(id);
    }
    throw new ForbiddenException();
  }

  async checkPaymentExists(params: CreatePaymentDto): Promise<SuccessResponseDto> {
    return await this.paymentTrackingRepository.checkPaymentExists(params);
  }

  async filterPaymentSummmay(filter: PaymentSummaryFilterDto, user: UserEntity): Promise<PaymentSummaryAllDto> {
    const condition = {};
    const conditionRelation = { status: { [Op.not]: ProjectNS.Status.CLOSED } };
    const { statusPayment, statusProject, endDate, startDate } = filter;
    const startDateOfDay = moment(startDate).tz('Asia/Ho_Chi_Minh').startOf('day').toDate();
    const endDateOfDay = moment(endDate).tz('Asia/Ho_Chi_Minh').endOf('day').toDate();
    if (statusPayment !== PaymentNS.Status.ALL) {
      Object.assign(condition, {
        status: statusPayment,
      });
    }
    if (!isNil(startDate) && !isNil(endDate)) {
      Object.assign(condition, {
        paydate: { [Op.between]: [startDateOfDay, endDateOfDay] },
      });
    }
    let arrayStatusProject: string[] = [];
    if (statusProject === ProjectNS.StatusFilter.ALL) {
      arrayStatusProject = ProjectNS.StatusFilterList.ALL.split(', ');
    }
    if (statusProject === ProjectNS.StatusFilter.WITHOUTBIDDING) {
      arrayStatusProject = ProjectNS.StatusFilterList.WITHOUTBIDDING.split(', ');
    }
    Object.assign(conditionRelation, {
      status: { [Op.in]: arrayStatusProject },
    });
    const array = await this.paymentTrackingRepository.getArrayFilterSummary(
      filter,
      condition,
      conditionRelation,
      user,
    );
    const payment = await this.paymentTrackingRepository.getFilterPaymentSummary(condition, conditionRelation, user);
    const total = this.compute(payment);
    const paymentSummaryAll = await Promise.all(
      array.map(async (arr) => {
        if (filter.groupBy === GroupBy.PROJECT) {
          Object.assign(condition, {
            projectId: arr,
          });
          const payment = await this.paymentTrackingRepository.getPaymentSummary(condition, conditionRelation, user);
          const paymentDto: PaymentDto[] = [];
          const result = this.computeOne(payment.toDtos(), paymentDto);
          return new PaymentSummaryDto(result, paymentDto, undefined, paymentDto[0].project);
        }
        Object.assign(condition, {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('paydate')), arr.month),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('paydate')), arr.year),
          ],
        });
        const payment = await this.paymentTrackingRepository.getPaymentSummary(condition, conditionRelation, user);
        const paymentDto: PaymentDto[] = [];
        const result = this.computeOne(payment.toDtos(), paymentDto);
        const month = `${arr?.year}/${arr?.month}`;
        return new PaymentSummaryDto(result, paymentDto, month);
      }),
    );
    return new PaymentSummaryAllDto(total, paymentSummaryAll);
  }

  async filterPaymentSummmayGraphic(filter: PaymentSummaryFilterDto, user: UserEntity): Promise<PaymentSummaryGraphicAllDto> {
    const condition = {};
    const conditionRelation = { status: { [Op.not]: ProjectNS.Status.CLOSED } };
    const { statusPayment, statusProject, endDate, startDate } = filter;
    const startDateOfDay = moment(startDate).tz('Asia/Ho_Chi_Minh').startOf('day').toDate();
    const endDateOfDay = moment(endDate).tz('Asia/Ho_Chi_Minh').endOf('day').toDate();
    if (statusPayment !== PaymentNS.Status.ALL) {
      Object.assign(condition, {
        status: statusPayment,
      });
    }
    if (!isNil(startDate) && !isNil(endDate)) {
      Object.assign(condition, {
        paydate: { [Op.between]: [startDateOfDay, endDateOfDay] },
      });
    }
    let arrayStatusProject: string[] = [];
    if (statusProject === ProjectNS.StatusFilter.ALL) {
      arrayStatusProject = ProjectNS.StatusFilterList.ALL.split(', ');
    }
    if (statusProject === ProjectNS.StatusFilter.WITHOUTBIDDING) {
      arrayStatusProject = ProjectNS.StatusFilterList.WITHOUTBIDDING.split(', ');
    }
    Object.assign(conditionRelation, {
      status: { [Op.in]: arrayStatusProject },
    });
    const array = await this.paymentTrackingRepository.getArrayFilterSummaryGraphic(
      filter,
      condition,
      conditionRelation,
      user,
    );
    const payment = await this.paymentTrackingRepository.getFilterPaymentSummary(condition, conditionRelation, user);
    const total = this.computeGraphic(payment);
    const paymentSummaryAll = await Promise.all(
      array.map(async (arr) => {
        Object.assign(condition, {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('paydate')), arr.month),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('paydate')), arr.year),
          ],
        });
        const month = `${arr?.year}/${arr?.month}`;
        if (filter.groupBy === GroupBy.PROJECT) {
          Object.assign(condition, {
            projectId: arr.projectId,
          });
          const payment = await this.paymentTrackingRepository.getPaymentSummary(condition, conditionRelation, user);
          const paymentDto: PaymentDto[] = [];
          const result = this.computeOneGraphic(payment.toDtos(), paymentDto);
          return new PaymentSummaryGraphicMonthDto(result, month, paymentDto[0].project?.name);
        }
        const payment = await this.paymentTrackingRepository.getPaymentSummary(condition, conditionRelation, user);
        const paymentDto: PaymentDto[] = [];
        const result = this.computeOneGraphic(payment.toDtos(), paymentDto);
        return new PaymentSummaryGraphicMonthDto(result, month, undefined);
      }),
    );
    return new PaymentSummaryGraphicAllDto(total, paymentSummaryAll);
  }

  private computeOne(payments: PaymentDto[], paymentDto: PaymentDto[]): TotalSummaryDto {
    return payments.reduce(
      (obj: TotalSummaryDto, p: PaymentDto) => {
        paymentDto.push(p);
        if (p.status === PaymentNS.Status.PROCESSING || p.status === PaymentNS.Status.PENDING || p.status === PaymentNS.Status.NEW) {
          obj.pendingEffort += p.effort;
          if (p.project && p.project.currency === ProjectNS.Currency.YEN) {
            obj.pendingJpy += p.amount;
          }
          if (p.project && p.project.currency === ProjectNS.Currency.VND) {
            obj.pendingVnd += p.amount;
          }
          if (p.project && p.project.currency === ProjectNS.Currency.DOLA) {
            obj.pendingUsd += p.amount;
          }
        }
        if (p.status === PaymentNS.Status.PAID) {
          obj.receivedEffort += p.effort;
          if (p.project && p.project.currency === ProjectNS.Currency.YEN) {
            obj.receivedJpy += p.amount;
          }
          if (p.project && p.project.currency === ProjectNS.Currency.VND) {
            obj.receivedVnd += p.amount;
          }
          if (p.project && p.project.currency === ProjectNS.Currency.DOLA) {
            obj.receivedUsd += p.amount;
          }
        }
        obj.count += 1;
        return obj;
      },
      {
        pendingEffort: +0,
        pendingJpy: +0,
        pendingVnd: +0,
        pendingUsd: +0,
        receivedEffort: +0,
        receivedJpy: +0,
        receivedVnd: +0,
        receivedUsd: +0,
        count: +0,
      },
    );
  }
  private computeOneGraphic(payments: PaymentDto[], paymentDto: PaymentDto[]): TotalSummaryGraphicDto {
    return payments.reduce(
      (obj: TotalSummaryGraphicDto, p: PaymentDto) => {
        paymentDto.push(p);
        if (p.status === PaymentNS.Status.PROCESSING || p.status === PaymentNS.Status.PENDING || p.status === PaymentNS.Status.NEW) {
          if(!isNil(obj.pendingEffort)) {
            obj.pendingEffort += p.effort;
          } else {
            obj.pendingEffort = p.effort;
          }
          if(p.project && p.project.currency === ProjectNS.Currency.VND) {
            if(!isNil(obj.pending)) {
              obj.pending += p.amount;
            } else {
              obj.pending = p.amount;
            }
          } else {
            if(!isNil(obj.pending)) {
              obj.pending += p.amountVND??0;
            } else {
              obj.pending = p.amountVND??0;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.YEN) {
            if(!isNil(obj.pendingJpy)) {
              obj.pendingJpy += p.amount;
            } else {
              obj.pendingJpy = p.amount;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.VND) {
            if(!isNil(obj.pendingVnd)) {
              obj.pendingVnd += p.amount;
            } else {
              obj.pendingVnd = p.amount;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.DOLA) {
            if(!isNil(obj.pendingUsd)) {
              obj.pendingUsd += p.amount;
            } else {
              obj.pendingUsd = p.amount;
            }
          }
        }
        if (p.status === PaymentNS.Status.PAID) {
          if(!isNil(obj.receivedEffort)) {
            obj.receivedEffort += p.effort;
          } else {
            obj.receivedEffort = p.effort;
          }
          if(p.project && p.project.currency === ProjectNS.Currency.VND) {
            if(!isNil(obj.received)) {
              obj.received += p.amount;
            } else {
              obj.received = p.amount;
            }
          } else {
            if(!isNil(obj.received)) {
              obj.received += p.amountVND??0;
            } else {
              obj.received = p.amountVND??0;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.YEN) {
            if(!isNil(obj.receivedJpy)) {
              obj.receivedJpy += p.amount;
            } else {
              obj.receivedJpy = p.amount;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.VND) {
            if(!isNil(obj.receivedVnd)) {
              obj.receivedVnd += p.amount;
            } else {
              obj.receivedVnd = p.amount;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.DOLA) {
            if(!isNil(obj.receivedUsd)) {
              obj.receivedUsd += p.amount;
            } else {
              obj.receivedUsd = p.amount;
            }
          }
        }
        return obj;
      },
      {
        pendingEffort: null,
        pending: null,
        pendingJpy: null,
        pendingVnd: null,
        pendingUsd: null,
        receivedEffort: null,
        received: null,
        receivedJpy: null,
        receivedVnd: null,
        receivedUsd: null,
      },
    );
  }
  private compute(tablePayment: PaymentDto[]): TotalEffortDto {
    return tablePayment.reduce(
      (obj: TotalEffortDto, p: PaymentDto) => {
        if (p.status === PaymentNS.Status.PAID) {
          obj.effortPaid += p.effort;
          if (p.project && p.project.currency === ProjectNS.Currency.YEN) {
            obj.amountReceivedJpy += p.amount;
          }
          if (p.project && p.project.currency === ProjectNS.Currency.VND) {
            obj.amountReceivedVnd += p.amount;
          }
          if (p.project && p.project.currency === ProjectNS.Currency.DOLA) {
            obj.amountReceivedUsd += p.amount;
          }
        }
        if (p.status === PaymentNS.Status.PROCESSING || p.status === PaymentNS.Status.PENDING || p.status === PaymentNS.Status.NEW) {
          obj.effortPending += p.effort;
          if (p.project && p.project.currency === ProjectNS.Currency.YEN) {
            obj.amountPendingJpy += p.amount;
          }
          if (p.project && p.project.currency === ProjectNS.Currency.VND) {
            obj.amountPendingVnd += p.amount;
          }
          if (p.project && p.project.currency === ProjectNS.Currency.DOLA) {
            obj.amountPendingUsd += p.amount;
          }
        }
        if (p.status === PaymentNS.Status.CANCELLED) {
          obj.effortCancelled += p.effort;
        }
        return obj;
      },
      {
        effortPaid: +0,
        effortPending: +0,
        effortCancelled: +0,
        amountPendingJpy: +0,
        amountPendingVnd: +0,
        amountPendingUsd: +0,
        amountReceivedJpy: +0,
        amountReceivedVnd: +0,
        amountReceivedUsd: +0,
      },
    );
  }
  private computeGraphic(tablePayment: PaymentDto[]): TotalEffortGraphicDto {
    return tablePayment.reduce(
      (obj: TotalEffortGraphicDto, p: PaymentDto) => {
        if (p.status === PaymentNS.Status.PAID) {
          if(!isNil(obj.effortPaid)) {
            obj.effortPaid += p.effort;
          } else {
            obj.effortPaid = p.effort;
          }
          if(p.project && p.project.currency === ProjectNS.Currency.VND) {
            if(!isNil(obj.amountReceived)) {
              obj.amountReceived += p.amount;
            } else {
              obj.amountReceived = p.amount;
            }
          } else {
            if(!isNil(obj.amountReceived)) {
              obj.amountReceived += p.amountVND??0;
            } else {
              obj.amountReceived = p.amountVND??0;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.YEN) {
            if(!isNil(obj.amountReceivedJpy)) {
              obj.amountReceivedJpy += p.amount;
            } else {
              obj.amountReceivedJpy = p.amount;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.VND) {
            if(!isNil(obj.amountReceivedVnd)) {
              obj.amountReceivedVnd += p.amount;
            } else {
              obj.amountReceivedVnd = p.amount;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.DOLA) {
            if(!isNil(obj.amountReceivedUsd)) {
              obj.amountReceivedUsd += p.amount;
            } else {
              obj.amountReceivedUsd = p.amount;
            }
          }
        }
        if (p.status === PaymentNS.Status.PROCESSING || p.status === PaymentNS.Status.PENDING || p.status === PaymentNS.Status.NEW) {
          if(!isNil(obj.effortPending)) {
            obj.effortPending += p.effort;
          } else {
            obj.effortPending = p.effort;
          }
          if(p.project && p.project.currency === ProjectNS.Currency.VND) {
            if(!isNil(obj.amountPending)) {
              obj.amountPending += p.amount;
            } else {
              obj.amountPending = p.amount;
            }
          } else {
            if(!isNil(obj.amountPending)) {
              obj.amountPending += p.amountVND??0;
            } else {
              obj.amountPending = p.amountVND??0;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.YEN) {
            if(!isNil(obj.amountPendingJpy)) {
              obj.amountPendingJpy += p.amount;
            } else {
              obj.amountPendingJpy = p.amount;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.VND) {
            if(!isNil(obj.amountPendingVnd)) {
              obj.amountPendingVnd += p.amount;
            } else {
              obj.amountPendingVnd = p.amount;
            }
          }
          if (p.project && p.project.currency === ProjectNS.Currency.DOLA) {
            if(!isNil(obj.amountPendingUsd)) {
              obj.amountPendingUsd += p.amount;
            } else {
              obj.amountPendingUsd = p.amount;
            }
          }
        }
        if (p.status === PaymentNS.Status.CANCELLED) {
          if(!isNil(obj.effortCancelled)) {
            obj.effortCancelled += p.effort;
          } else {
            obj.effortCancelled = p.effort;
          }
        }
        return obj;
      },
      {
        effortPaid: null,
        effortPending: null,
        effortCancelled: null,
        amountPending: null,
        amountReceived: null,
        amountPendingJpy: null,
        amountPendingVnd: null,
        amountPendingUsd: null,
        amountReceivedJpy: null,
        amountReceivedVnd: null,
        amountReceivedUsd: null,
      },
    );
  }

  async deletePaymentByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.paymentTrackingRepository.deletePaymentByProjectId(projectId, t);
  }

  async getTotalPaymentByProjectId(projectId: number, status: PaymentNS.Status): Promise<number> {
    return await this.paymentTrackingRepository.getTotalPaymentByProjectId(projectId, status);
  }
}
