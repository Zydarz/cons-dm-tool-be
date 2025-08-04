import { ApiPropertyOptional } from '@nestjs/swagger';

export class TotalUserSummaryDto {
  @ApiPropertyOptional()
  totalMember: number;

  @ApiPropertyOptional()
  totalMM: number;

  @ApiPropertyOptional()
  totalAC: number;

  @ApiPropertyOptional()
  totalTC: number;
}
