import { ApiProperty } from '@nestjs/swagger';
import { MemberTeamProjectdto } from './member-post-team-dto';

export class PostTeamProjectdto {
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  projectName: string;

  @ApiProperty()
  month: Date;

  @ApiProperty()
  members: MemberTeamProjectdto[];
}
