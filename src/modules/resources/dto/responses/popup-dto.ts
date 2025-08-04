import { ApiProperty } from '@nestjs/swagger';

export class PopUpDto {
  @ApiProperty()
  projectRank?: string;

  @ApiProperty()
  ce: number;

  @ApiProperty()
  actualEffort: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;
}
