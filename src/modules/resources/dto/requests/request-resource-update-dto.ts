import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { CheckAcZeroOrTcZero } from '../../../../decorators/check-ac-tc-zero.decorator';

export class RequestResourceDto {
  @ApiProperty()
  @IsNumber()
  readonly currentPositionId: number;

  @ApiProperty()
  @IsNumber()
  readonly newPositionId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly projectRankId: number;

  @ApiProperty()
  @IsDateString()
  readonly startDate: Date;

  @ApiProperty()
  @IsDateString()
  readonly endDate: Date;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  readonly acPercent: number = 0;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  @CheckAcZeroOrTcZero(RequestResourceDto, (r) => r.acPercent)
  readonly tcPercent: number = 0;

  @ApiPropertyOptional()
  @IsString()
  readonly note: string;
}
