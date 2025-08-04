import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { default as UserEntity } from '../../../../entities/users.entity';
import { UserSalaryDto } from '../../../../modules/user-salary/dto/responses/user-salary.dto';
import { MasterDataDto } from '../../../../modules/master-data/dtos/master-data.dto';

export class SalaryDto {
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

  @ApiProperty()
  jobRank?: MasterDataDto;

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
