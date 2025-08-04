import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min, MaxLength, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { CheckAcZeroOrTcZero } from '../../../../decorators/check-ac-tc-zero.decorator';

export class UserResourceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  readonly projectId: number;

  @ApiProperty()
  @IsDateString()
  readonly startDate: Date;

  @ApiProperty()
  @IsDateString()
  readonly endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  readonly positionId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly projectRankId: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  readonly acPercent: number = 0;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  @CheckAcZeroOrTcZero(UserResourceDto, (u) => u.acPercent)
  readonly tcPercent: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly note: string;
}
