import { Inject } from '@nestjs/common';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { default as PaymentEntity } from '../entities/payment-tracking.entity';
import { PaymentNS } from '../modules/payment-tracking/interfaces/payment-tracking';
import { isNil } from 'lodash';
import { UpdatePaymentDto } from '../modules/payment-tracking/dto/requests/update-payment-tracking.dto';
import { CreatePaymentDto } from '../modules/payment-tracking/dto/requests/create-payment-tracking.dto';
import { PaymentResDto } from '../common/dto/payment.response.dto';
import { PaymentFilterOptionsDto } from '../modules/payment-tracking/dto/requests/payment-filter-options.dto';
import { ComputeEffortDto } from '../common/dto/computeEffort.dto';
import { PaymentDto } from '../modules/payment-tracking/dto/responses/payment-dto';
import sequelize, { Op, Transaction, WhereOptions, Sequelize } from 'sequelize';
import { PaymentSummaryFilterDto } from '../modules/payment-tracking/dto/requests/payment-summary-filter.dto';
import { GroupBy } from '../common/constants/group-by';
import moment from 'moment';
import { default as ProjectEntity } from '../entities/project.entity';
import { UserNS } from '../modules/users/interface/users';
import { default as UserProjectEntity } from '../entities/user_project.entity';
import { default as UserEntity } from '../entities/users.entity';

export class PaymentTrackingRepository implements PaymentNS.IPaymentTrackingRepository {
  constructor(
    @Inject(PaymentEntity.name)
    private readonly paymentEntity: typeof PaymentEntity,
  ) {}

  async findById(id: number): Promise<PaymentEntity> {
    const payment = await this.paymentEntity.findByPk(id);
    if (isNil(payment)) {
      throw PaymentNS.errMsg.PaymentNotFound;
    }
    return payment;
  }
  async getAll(projectId: number): Promise<PaymentResDto> {
    const tablePayment = await this.paymentEntity.findAll({
      where: {
        projectId,
      },
    });
    const compute = tablePayment.reduce(
      (obj: ComputeEffortDto, p: PaymentEntity) => {
        if (p.status === PaymentNS.Status.PAID) {
          obj.effortPaid += p.effort;
          obj.amountReceived += p.amount;
        }
        if (p.status === PaymentNS.Status.PENDING || p.status === PaymentNS.Status.PROCESSING || p.status === PaymentNS.Status.NEW) {
          obj.effortPending += p.effort;
          obj.amountPending += p.amount;
        }
        if (p.status === PaymentNS.Status.CANCELLED) {
          obj.effortCancelled += p.effort;
        }
        return obj;
      },
      { effortPaid: +0, effortPending: +0, effortCancelled: +0, amountPending: +0, amountReceived: +0 },
    );

    const paymentRes: PaymentResDto = {
      data: tablePayment.toDtos(),
      paymentSum: compute,
    };
    return paymentRes;
  }

  async getFilter(paramPaymentFilter: PaymentFilterOptionsDto): Promise<PaymentDto[]> {
    const { projectId, status } = paramPaymentFilter;
    const paymentCondition: WhereOptions = {};
    if (status !== PaymentNS.Status.ALL) {
      paymentCondition.status = status;
    }
    paymentCondition.projectId = +projectId;
    const paymentFilter = await this.paymentEntity.findAll({
      where: paymentCondition,
      order: [['id', 'DESC']],
    });
    return paymentFilter.toDtos();
  }

  async createPayment(param: CreatePaymentDto): Promise<PaymentEntity> {
    const paydate = moment(param.paydate).tz('Asia/Ho_Chi_Minh').endOf('day').toDate();
    const payment = await this.paymentEntity.create({
      title: param.title,
      effort: param.effort,
      amount: param.amount,
      amountVND: param.amountVND,
      paydate,
      status: param.status,
      note: param.note,
      projectId: param.projectId,
    });
    return payment;
  }

  async updatePayment(id: number, param: UpdatePaymentDto): Promise<PaymentEntity> {
    const payment = await this.paymentEntity.findByPk(id);
    const paydate = moment(param.paydate).tz('Asia/Ho_Chi_Minh').endOf('day').toDate();
    if (isNil(payment)) {
      throw PaymentNS.errMsg.PaymentNotFound;
    }

    await payment.update({
      title: param.title,
      effort: param.effort,
      amount: param.amount,
      amountVND: param.amountVND,
      paydate,
      status: param.status,
      note: param.note,
    });
    return payment;
  }

  async deletePayment(id: number): Promise<SuccessResponseDto> {
    const payment = await this.paymentEntity.findByPk(id);
    if (isNil(payment)) {
      return new SuccessResponseDto(false);
    }
    await payment.destroy();
    return new SuccessResponseDto(true);
  }
  async getArrayFilterSummary(
    filter: PaymentSummaryFilterDto,
    condition: any,
    conditionRelation: any,
    user: UserEntity,
  ) {
    const includes = this.generateQuery(conditionRelation, user);
    const { groupBy } = filter;
    let group;
    if (groupBy === GroupBy.PROJECT) {
      group = [PaymentNS.Type.PROJECTID];
      const payment = await this.paymentEntity.findAll({
        where: condition,
        include: includes,
        attributes: [PaymentNS.Type.PROJECTID],
        group,
        raw: true,
      });
      const array = payment.map((p) => p.projectId);
      return array;
    }
    group = [PaymentNS.Type.MONTH, PaymentNS.Type.YEAR];
    const payment = await this.paymentEntity.findAll({
      where: condition,
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('paydate')), PaymentNS.Type.MONTH],
        [sequelize.fn('YEAR', sequelize.col('paydate')), PaymentNS.Type.YEAR],
        ['projectId', 'projectId'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      ],
      group: [
        'projectId',
        sequelize.fn('MONTH', sequelize.col('paydate')),
        sequelize.fn('YEAR', sequelize.col('paydate')),
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('paydate')), 'DESC'],
        [sequelize.fn('MONTH', sequelize.col('paydate')), 'DESC'],
      ],
      raw: true,
    });
    
    
    const array = payment.map((p) => ({
      month: p.getDataValue(PaymentNS.Type.MONTH),
      year: p.getDataValue(PaymentNS.Type.YEAR),
    }));
    return array;
  }
  async getArrayFilterSummaryGraphic(
    filter: PaymentSummaryFilterDto,
    condition: any,
    conditionRelation: any,
    user: UserEntity,
  ) {
    const includes = this.generateQuery(conditionRelation, user);
    const { groupBy } = filter;
    let group;
    if (groupBy === GroupBy.PROJECT) {
      group = [PaymentNS.Type.PROJECTID, PaymentNS.Type.MONTH, PaymentNS.Type.YEAR];
      const payment = await this.paymentEntity.findAll({
        where: condition,
        include: includes,
        attributes: [
          [sequelize.fn('MONTH', sequelize.col('paydate')), PaymentNS.Type.MONTH],
          [sequelize.fn('YEAR', sequelize.col('paydate')), PaymentNS.Type.YEAR],
          PaymentNS.Type.PROJECTID,
        ],
        group,
        raw: true,
        order: [['paydate', 'DESC']],
      });
      return payment;
    }
    group = [PaymentNS.Type.MONTH, PaymentNS.Type.YEAR];
    const payment = await this.paymentEntity.findAll({
      where: condition,
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('paydate')), PaymentNS.Type.MONTH],
        [sequelize.fn('YEAR', sequelize.col('paydate')), PaymentNS.Type.YEAR],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      ],
      group: [
        sequelize.fn('MONTH', sequelize.col('paydate')),
        sequelize.fn('YEAR', sequelize.col('paydate')),
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('paydate')), 'DESC'],
        [sequelize.fn('MONTH', sequelize.col('paydate')), 'DESC'],
      ],
      raw: true,
    });
    
    
    const array = payment.map((p) => ({
      month: p.getDataValue(PaymentNS.Type.MONTH),
      year: p.getDataValue(PaymentNS.Type.YEAR),
    }));
    return array;
  }
  async getPaymentSummary(condition: any, conditionRelation: any, user: UserEntity): Promise<PaymentEntity[]> {
    const includes = this.generateQuery(conditionRelation, user);
    const payment = await this.paymentEntity.findAll({
      where: condition,
      include: includes,
      order: [['paydate', 'DESC']],
    });
    return payment;
  }

  async getFilterPaymentSummary(condition: any, conditionRelation: any, user: UserEntity): Promise<PaymentDto[]> {
    const includes = this.generateQuery(conditionRelation, user);
    const payment = await this.paymentEntity.findAll({
      where: condition,
      include: includes,
    });
    return payment.toDtos();
  }
  private generateQuery(conditionRelation: any, user: UserEntity) {
    const conditionRelationUseProject = {};
    let include = {} as any;
    if (user.role === UserNS.Roles.MEMBER) {
      Object.assign(conditionRelationUseProject, {
        userId: user.id,
      });
      include = [
        {
          model: ProjectEntity,
          as: 'projects',
          where: conditionRelation,
          order: [['startDate', 'DESC']],
          include: [
            {
              model: UserProjectEntity,
              as: 'userProject',
              where: conditionRelationUseProject,
            },
          ],
        },
      ];
    } else {
      include = [
        {
          model: ProjectEntity,
          as: 'projects',
          where: conditionRelation,
          order: [['startDate', 'DESC']],
        },
      ];
    }
    return include;
  }

  async deletePaymentByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    await this.paymentEntity.destroy({
      where: {
        projectId,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }

  async getTotalPaymentByProjectId(projectId: number, status: PaymentNS.Status): Promise<number> {
    const total = await this.paymentEntity.sum('amount', {
      where: {
        status,
        projectId,
      },
    });
    return total;
  }

  async checkPaymentExists(param: CreatePaymentDto): Promise<SuccessResponseDto> {
    const paydate = new Date(param.paydate);
    const payment = await this.paymentEntity.findOne({
      where: {
        [Op.and] : [
          sequelize.where(sequelize.fn('YEAR', sequelize.col('paydate')), paydate.getFullYear()),
          sequelize.where(sequelize.fn('MONTH', sequelize.col('paydate')), String(paydate.getMonth() + 1).padStart(2, '0')),
          {
            projectId : param.projectId,
            status : { [Op.ne]: 'Cancelled' }
          }
        ]
      }
    });
    if (isNil(payment)) {
      return new SuccessResponseDto(false);
    }
    return new SuccessResponseDto(true);
  }
}
