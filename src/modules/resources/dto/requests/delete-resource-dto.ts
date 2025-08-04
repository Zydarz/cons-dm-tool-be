import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, ValidateNested } from 'class-validator';

class UserDelete {
  @ApiProperty()
  @IsInt()
  userProjectId: number;

  @ApiProperty()
  @IsInt()
  positionId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}

export class DeleteResourceDto {
  @ApiProperty({ type: [UserDelete] })
  @ValidateNested({ each: true })
  @Type(() => UserDelete)
  resources: UserDelete[];
}
