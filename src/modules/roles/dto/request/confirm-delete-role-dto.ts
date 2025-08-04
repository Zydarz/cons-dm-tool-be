import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteRoleDto {
  @ApiProperty()
  @IsNumber()
  oldRoleId: number;

  @ApiProperty()
  @IsNumber()
  newRoleId: number;
}
