import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/response/user-dto';
import { default as UserEntity } from '../../../../entities/users.entity';
import { TimeSheetProjectOfMemberDto } from './timesheet-project-member-dto';
import { TimeSheetMemberDto } from 'modules/users/dto/response/user-project-dto';

export class TimeSheetProjectDto  {
  
  @ApiProperty()
  projects: TimeSheetProjectOfMemberDto[];

  @ApiPropertyOptional({ type: () => [UserDto] })
  members?: TimeSheetMemberDto[];

  constructor(project: TimeSheetProjectOfMemberDto[], user?: TimeSheetMemberDto[]) {
    this.projects = project;
    this.members = user;
  }
}
