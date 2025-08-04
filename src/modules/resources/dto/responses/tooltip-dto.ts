import { ApiProperty } from '@nestjs/swagger';

export class TooltipUpDto {
  @ApiProperty()
  acTotal: number;

  @ApiProperty()
  tcTotal: number;

  @ApiProperty()
  committed: number;

  @ApiProperty()
  startDate?: Date;

  @ApiProperty()
  endDate?: Date;
}
