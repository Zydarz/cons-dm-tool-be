import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { UserResourceDto } from './user-resource-dto';
import { Type } from 'class-transformer';

export class CreateResourceDto {
  @ApiProperty({ type: [UserResourceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserResourceDto)
  readonly resources: UserResourceDto[];
}
