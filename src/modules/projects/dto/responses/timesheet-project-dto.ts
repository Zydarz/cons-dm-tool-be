import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/response/user-dto';
import { default as UserEntity } from '../../../../entities/users.entity';
import { TimeSheetProjectMemberDto } from './timesheet-project-member-dto';

export class TimeSheetProjectDto  {
  
  @ApiProperty()
  projects: TimeSheetProjectMemberDto[];

  @ApiPropertyOptional({ type: () => [UserDto] })
  users?: UserDto[];

  constructor(project: TimeSheetProjectMemberDto[], user?: UserDto[]) {
    this.projects = project;
    this.users = user;
  }
}
