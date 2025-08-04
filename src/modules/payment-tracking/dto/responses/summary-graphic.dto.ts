import { ApiProperty } from '@nestjs/swagger';

export class TotalSummaryGraphicDto {
  @ApiProperty()
  pendingEffort: number | null;

  @ApiProperty()
  pending: number | null;
  @ApiProperty()
  pendingJpy: number | null;
  @ApiProperty()
  pendingVnd: number | null;
  @ApiProperty()
  pendingUsd: number | null;

  @ApiProperty()
  receivedEffort: number | null;

  @ApiProperty()
  received: number | null;
  @ApiProperty()
  receivedJpy: number | null;
  @ApiProperty()
  receivedVnd: number | null;
  @ApiProperty()
  receivedUsd: number | null;

  @ApiProperty()
  month?: string;

  @ApiProperty()
  projectID?: string;

  @ApiProperty()
  projectName?: string;

  constructor(total: TotalSummaryGraphicDto) {
    this.pendingEffort = total.pendingEffort;
    this.pending = total.pending;
    this.pendingJpy = total.pendingJpy;
    this.pendingVnd = total.pendingVnd;
    this.pendingUsd = total.pendingUsd;
    this.receivedEffort = total.receivedEffort;
    this.received = total.received;
    this.receivedJpy = total.receivedJpy;
    this.receivedVnd = total.receivedVnd;
    this.receivedUsd = total.receivedUsd;
    this.month = total.month;
    this.projectID = total.projectName;
    this.projectName = total.projectName;
  }
}
