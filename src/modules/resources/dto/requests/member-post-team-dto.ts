import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class MemberTeamProjectdto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  readonly acPercent: number = 0;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  readonly tcPercent: number = 0;
}
