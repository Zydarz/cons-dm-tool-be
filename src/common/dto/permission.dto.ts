import { ApiProperty } from '@nestjs/swagger';

export class PermissionMeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  action: any;
}
