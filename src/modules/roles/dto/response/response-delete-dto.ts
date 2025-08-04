import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from './role-dto';
export class ResponseDeleteDto {
  @ApiProperty()
  role: RoleDto;

  @ApiProperty()
  count: number;
}
