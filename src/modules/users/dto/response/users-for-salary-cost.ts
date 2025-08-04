import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { default as UserEntity } from '../../../../entities/users.entity';

export class UserForSalaryCostDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mail: string;

  @ApiPropertyOptional()
  surName?: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.mail = user.mail;
    this.surName = user.surName;
  }
}
