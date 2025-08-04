import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';
import { UserNS } from '../../../users/interface/users';

export class DetailFullUpdateOtherCostDto {
  @ApiProperty()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  settingOtherCostId: string;

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 15 })
  @IsOptional()
  @Max(999999999999999)
  @Min(0)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

}
