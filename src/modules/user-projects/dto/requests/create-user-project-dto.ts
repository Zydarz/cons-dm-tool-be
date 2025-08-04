import { ApiProperty } from '@nestjs/swagger';

export class CreateUserProjectDto {
  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly projectId: number;
}
