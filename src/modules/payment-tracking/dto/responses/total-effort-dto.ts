import { ApiPropertyOptional } from '@nestjs/swagger';

export class TotalEffortDto {
  @ApiPropertyOptional()
  effortPaid: number;

  @ApiPropertyOptional()
  effortPending: number;

  @ApiPropertyOptional()
  effortCancelled: number;

  @ApiPropertyOptional()
  amountPendingJpy: number;

  @ApiPropertyOptional()
  amountPendingVnd: number;

  @ApiPropertyOptional()
  amountPendingUsd: number;

  @ApiPropertyOptional()
  amountReceivedJpy: number;

  @ApiPropertyOptional()
  amountReceivedVnd: number;

  @ApiPropertyOptional()
  amountReceivedUsd: number;
}
