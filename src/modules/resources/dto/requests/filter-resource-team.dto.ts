import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class FilterResourceTeamDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  readonly endDate: Date;

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  readonly projectIds: number[];
}
