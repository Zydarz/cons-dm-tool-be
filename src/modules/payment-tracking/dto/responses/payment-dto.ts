import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaymentNS } from '../../interfaces/payment-tracking';
import { default as PaymentEntity } from '../../../../entities/payment-tracking.entity';
import { AbstractBigDto } from '../../../../common/dto/abstractBigInt.dto';
import { ProjectDto } from '../../../../modules/projects/dto/responses/project-dto';
export class PaymentDto extends AbstractBigDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  effort: number;

  @ApiPropertyOptional()
  @IsOptional()
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  amountVND?: number;

  @ApiPropertyOptional()
  @IsOptional()
  paydate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  status: PaymentNS.Status;

  @ApiPropertyOptional()
  @IsOptional()
  note: string;

  @ApiPropertyOptional()
  @IsOptional()
  projectId: number;

  @ApiProperty()
  readonly project?: ProjectDto;

  constructor(payment: PaymentEntity) {
    super(payment);
    this.title = payment.title;
    this.date = payment.date;
    this.effort = payment.effort;
    this.amount = payment.amount;
    this.amountVND = payment.amountVND;
    this.paydate = payment.paydate;
    this.status = payment.status;
    this.note = payment.note;
    this.projectId = payment.projectId;
    this.project = payment.projects?.toDto();
  }
}
