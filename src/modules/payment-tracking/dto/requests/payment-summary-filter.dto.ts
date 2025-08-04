import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ProjectNS } from '../../../../modules/projects/interfaces/project';
import { PaymentNS } from '../../interfaces/payment-tracking';
import { GroupBy } from '../../../../common/constants/group-by';
export class PaymentSummaryFilterDto {
  @ApiProperty()
  @IsEnum(GroupBy)
  groupBy: GroupBy;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PaymentNS.Status)
  readonly statusPayment?: PaymentNS.Status = PaymentNS.Status.ALL;

  @ApiPropertyOptional()
  @IsOptional()
  readonly statusProject: string = ProjectNS.StatusFilter.ALL;

  @ApiPropertyOptional()
  @IsOptional()
  readonly startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  readonly endDate: Date;
}
