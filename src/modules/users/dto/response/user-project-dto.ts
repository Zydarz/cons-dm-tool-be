import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { default as UserEntity } from '../../../../entities/users.entity';
import { AbstractDto } from '../../../../common/dto/abstract.dto';


export class TimeSheetMemberDto extends AbstractDto {
  @ApiProperty()
  projectIds?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  surName?: string;

  @ApiProperty()
  username?: string;

  // SỬA ĐỔI CONSTRUCTOR: Thêm tham số projectId
  constructor(user: UserEntity, projectIds?: string) {
    super(user);
    this.email = user.mail;
    this.surName = user.surName;
    this.username = user.username;
    this.projectIds = projectIds; // Gán projectId
  }
}