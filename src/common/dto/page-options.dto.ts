import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { Order } from '../constants/order';

export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.DESC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order = Order.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100000,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100000)
  @IsOptional()
  take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly q?: string;
}
