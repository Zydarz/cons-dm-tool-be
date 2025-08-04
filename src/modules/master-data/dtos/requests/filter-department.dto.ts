import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterDepartmentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderField?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderType?: string;
}
