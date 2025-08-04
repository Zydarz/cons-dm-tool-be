import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { default as DaysOffEntity } from '../../../../entities/days-off.entity';
import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class DaysOffDto extends AbstractDto {
  @ApiProperty()
  date: Date;

  @ApiPropertyOptional()
  note?: string;

  @ApiPropertyOptional()
  idSame?: string;

  constructor(daysOff: DaysOffEntity) {
    super(daysOff);
    this.date = daysOff.date;
    this.note = daysOff.note;
    this.idSame = daysOff.idSame;
  }
}
