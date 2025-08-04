import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetAllResourceSummaryDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  projectId: number;
}
