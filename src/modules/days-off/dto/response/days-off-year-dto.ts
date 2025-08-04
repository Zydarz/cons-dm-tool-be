import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DaysOffYearDto {
  @ApiProperty()
  startDate: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  note?: string;

  @ApiPropertyOptional()
  idSame?: string;

  @ApiPropertyOptional()
  update?: Date;

  constructor(start: Date, end: Date, note: string, idSame: string, update: Date) {
    this.startDate = start;
    this.endDate = end;
    this.note = note;
    this.idSame = idSame;
    this.update = update;
  }
}
