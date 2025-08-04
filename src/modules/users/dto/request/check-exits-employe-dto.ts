import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckExitsEmployeeDto {
  @ApiProperty()
  @IsString()
  readonly employeeId: string;

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;
}
