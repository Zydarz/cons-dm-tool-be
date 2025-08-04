import { ApiProperty } from '@nestjs/swagger';

export class projectSituationDetailDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly submitterId: string;

  @ApiProperty()
  readonly projectId: number;

  @ApiProperty()
  readonly note: string;

  @ApiProperty()
  readonly flag: number;

  @ApiProperty()
  readonly date: Date;
}
