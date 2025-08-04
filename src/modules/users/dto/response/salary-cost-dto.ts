import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { default as UserEntity } from '../../../../entities/users.entity';
import { UserSalaryDto } from '../../../user-salary/dto/responses/user-salary.dto';

export class SalaryCostDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  surName?: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  userSalaries?: UserSalaryDto[];

  constructor(
    entity: UserEntity,
    userSalaries?: UserSalaryDto[],
  ) {
    this.id = entity.id;
    this.mail = entity.mail;
    this.displayName = entity.displayName;
    this.surName = entity.surName;
    this.username = entity.username;
    this.createdAt = entity.createdAt;
    this.userSalaries = entity.userSalaries?.toDtos() ?? userSalaries;
  }
}
