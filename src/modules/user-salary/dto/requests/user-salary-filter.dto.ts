import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserSalaryFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  readonly startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  readonly endDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  readonly userIds: String[];

  @ApiPropertyOptional()
  @IsOptional()
  departmentId?: string;
}
