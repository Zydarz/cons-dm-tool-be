import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConfirmOverResourceDto {
  @ApiProperty()
  @IsString()
  readonly verifyToken: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly edit?: string;
}
