import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { RequestResourceDto } from './request-resource-update-dto';
import { Type } from 'class-transformer';

export class UpdateResourceDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestResourceDto)
  readonly resources: RequestResourceDto[];
}
