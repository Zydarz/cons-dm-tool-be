import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { RequestLogWorkDto } from './request-log-work-dto';

export class CreateLogWorkDto {
  @ApiProperty({
    type: [RequestLogWorkDto],
  })
  @Type(() => RequestLogWorkDto)
  @IsArray()
  readonly logWorks: RequestLogWorkDto[];
}
