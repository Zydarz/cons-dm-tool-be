import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';

export class ResourceAllocateDto {
  @ApiProperty()
  allocated?: number;

  @ApiPropertyOptional()
  committed?: number;

  @ApiProperty()
  date?: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiPropertyOptional()
  @Min(0)
  @Max(100)
  ac: number;

  @ApiPropertyOptional()
  @Min(0)
  @Max(100)
  tc: number;

  @ApiPropertyOptional()
  detail?: any;
}
