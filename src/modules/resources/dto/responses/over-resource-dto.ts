import { ApiProperty } from '@nestjs/swagger';

export class OverResourceDto {
  @ApiProperty()
  userId?: string;

  @ApiProperty()
  userName?: string;

  @ApiProperty()
  startDate?: Date;

  @ApiProperty()
  endDate?: Date;

  @ApiProperty()
  total?: number;

  constructor(userId?: string, startDate?: Date, endDate?: Date, total?: number, userName?: string) {
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.total = total;
    this.userName = userName;
  }
}
