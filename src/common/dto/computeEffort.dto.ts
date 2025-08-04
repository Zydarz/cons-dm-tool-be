import { ApiPropertyOptional } from '@nestjs/swagger';

export class ComputeEffortDto {
  @ApiPropertyOptional()
  effortPaid: number;

  @ApiPropertyOptional()
  effortPending: number;

  @ApiPropertyOptional()
  effortCancelled: number;

  @ApiPropertyOptional()
  amountPending: number;

  @ApiPropertyOptional()
  amountReceived: number;
}
