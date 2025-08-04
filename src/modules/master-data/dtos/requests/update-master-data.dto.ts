import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMasterDataDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  order: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;
}
