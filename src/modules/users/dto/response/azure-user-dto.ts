import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AzureUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  displayName: string;

  @ApiPropertyOptional()
  givenName?: string;

  @ApiPropertyOptional()
  surname?: string;

  @ApiPropertyOptional()
  username?: string;
}
