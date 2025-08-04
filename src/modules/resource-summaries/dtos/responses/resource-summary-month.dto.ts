import { ApiProperty } from '@nestjs/swagger';

export class ResourceSummaryMonth {
  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;

  @ApiProperty()
  committedTotal?: number;

  @ApiProperty()
  allocatedTotal: number;

  @ApiProperty()
  temporaryAddedTotal: number;

  constructor(
    month: number,
    year: number,
    committedTotal?: number,
    allocatedTotal?: number,
    temporaryAddedTotal?: number,
  ) {
    this.year = year ?? 0;
    this.month = month ?? 0;
    this.committedTotal = committedTotal ?? 0;
    this.allocatedTotal = allocatedTotal ?? 0;
    this.temporaryAddedTotal = temporaryAddedTotal ?? 0;
  }
}
