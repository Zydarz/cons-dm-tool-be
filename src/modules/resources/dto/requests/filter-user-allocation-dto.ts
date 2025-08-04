import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserNS } from '../../../../modules/users/interface/users';
import { AllocateGroupType } from '../../../../common/constants/allocate-group-type';
import { GetUserDto } from '../../../../modules/users/dto/request/get-user-dto';
import { Type } from 'class-transformer';

export class FilterUserAllowcationDto extends GetUserDto {
  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ enum: AllocateGroupType })
  @IsEnum(AllocateGroupType)
  readonly allocateGroupType: AllocateGroupType;

  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  role?: UserNS.Roles;

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  projectIds?: number[];

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  divisionIds?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  positionIds?: number[];
}
