import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ParamUpdateDayOffDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly idSame: string;
}
