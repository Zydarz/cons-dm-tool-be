import { BelongsTo, Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { AbstractWithBigIntIDEntity } from '../common/abstractWithBigIntergerID.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { PaymentDto } from '../modules/payment-tracking/dto/responses/payment-dto';
import { PaymentNS } from '../modules/payment-tracking/interfaces/payment-tracking';
import { default as ProjectEntity } from './project.entity';

const STATUS = PaymentNS.Status;
@Table({ modelName: 'payment_trackings' })
@UseDto(PaymentDto)
export default class PaymentEntity extends AbstractWithBigIntIDEntity<PaymentDto> {
  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.DATE })
  date: Date;

  @Column({ type: DataType.INTEGER })
  effort: number;

  @Column({ type: DataType.INTEGER })
  amount: number;

  @Column({ type: DataType.INTEGER })
  amountVND?: number;

  @Column({ type: DataType.DATE })
  paydate: Date;

  @Column({ type: DataType.ENUM(STATUS.PENDING, STATUS.PAID, STATUS.CANCELLED, STATUS.PROCESSING) })
  status: PaymentNS.Status;

  @Column({ type: DataType.TEXT })
  note: string;

  @Column({ type: DataType.BIGINT })
  projectId: number;

  @BelongsTo(() => ProjectEntity, 'projectId')
  projects?: ProjectEntity;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Column({ type: DataType.DATE })
  @DeletedAt
  deletedAt?: Date;
}
