import { ApiProperty } from '@nestjs/swagger';

export class TotalResourceProjectDto {
  @ApiProperty()
  committedTotal: number;

  @ApiProperty()
  allocatedTotal: number;

  @ApiProperty()
  temporaryAddedTotal: number;

  @ApiProperty()
  actualTotal: number;

  constructor(committedTotal?: number, allocatedTotal?: number, temporaryAddedTotal?: number, actualTotal?: number) {
    this.committedTotal = committedTotal ?? 0;
    this.allocatedTotal = allocatedTotal ?? 0;
    this.temporaryAddedTotal = temporaryAddedTotal ?? 0;
    this.actualTotal = actualTotal ?? 0;
  }
}
