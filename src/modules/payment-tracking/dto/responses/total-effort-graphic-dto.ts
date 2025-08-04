import { ApiPropertyOptional } from '@nestjs/swagger';

export class TotalEffortGraphicDto {
  @ApiPropertyOptional()
  effortPaid: number | null;

  @ApiPropertyOptional()
  effortPending: number | null;

  @ApiPropertyOptional()
  effortCancelled: number | null;

  @ApiPropertyOptional()
  amountPending: number | null;

  @ApiPropertyOptional()
  amountReceived: number | null;

  @ApiPropertyOptional()
  amountPendingJpy: number | null;

  @ApiPropertyOptional()
  amountPendingVnd: number | null;

  @ApiPropertyOptional()
  amountPendingUsd: number | null;

  @ApiPropertyOptional()
  amountReceivedJpy: number | null;

  @ApiPropertyOptional()
  amountReceivedVnd: number | null;

  @ApiPropertyOptional()
  amountReceivedUsd: number | null;
}
