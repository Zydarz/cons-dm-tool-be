import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
}
