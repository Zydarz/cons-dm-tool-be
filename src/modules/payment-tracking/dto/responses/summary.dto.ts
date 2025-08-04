import { ApiProperty } from '@nestjs/swagger';

export class TotalSummaryDto {
  @ApiProperty()
  count: number;

  @ApiProperty()
  pendingEffort: number;

  @ApiProperty()
  pendingJpy: number;

  @ApiProperty()
  pendingVnd: number;

  @ApiProperty()
  pendingUsd: number;

  @ApiProperty()
  receivedEffort: number;

  @ApiProperty()
  receivedJpy: number;

  @ApiProperty()
  receivedVnd: number;

  @ApiProperty()
  receivedUsd: number;

  constructor(total: TotalSummaryDto) {
    this.count = total.count;
    this.pendingEffort = total.pendingEffort;
    this.pendingJpy = total.pendingJpy;
    this.pendingVnd = total.pendingVnd;
    this.pendingUsd = total.pendingUsd;
    this.receivedEffort = total.receivedEffort;
    this.receivedJpy = total.receivedJpy;
    this.receivedVnd = total.receivedVnd;
    this.receivedUsd = total.receivedUsd;
  }
}
