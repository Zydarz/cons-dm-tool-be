import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { default as UserEntity } from '../../../../entities/users.entity';
import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class TimeSheetMemberDto extends AbstractDto {
 
   @ApiProperty()
   email: string;
 
   @ApiProperty()
  surName?: string;
 
   @ApiProperty()
   username?: string;
 
   constructor(user: UserEntity) {
     super(user); 
     this.email = user.mail;
     this.surName = user.surName;
     this.username = user.username;
   }
 }