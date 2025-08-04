import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { OverResourceDto } from './over-resource-dto';

export class TokenOverResourceDto {
  @ApiProperty()
  readonly verifyToken: string;

  @ApiProperty()
  @IsArray()
  readonly data: OverResourceDto[];
}
