import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FindUserDifferentProjectDto {
  @ApiProperty()
  @IsNumber()
  readonly userId: string;

  @ApiProperty()
  @IsNumber()
  readonly projectId: number;

  @ApiProperty()
  readonly startDate: Date;

  @ApiProperty()
  readonly endDate: Date;

  @ApiProperty()
  @IsNumber()
  readonly positionId: number;
}
