import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ParamPopupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly projectId: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly positionId: number;
}
