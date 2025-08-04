import { ApiPropertyOptional } from '@nestjs/swagger';
import { IUserSearch } from '../../../../interfaces/IUserSearch';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserNS } from '../../../../modules/users/interface/users';
import { Type } from 'class-transformer';

export class UserSearchDto implements IUserSearch {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lineId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  jobRankId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  departmentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  store?: UserNS.UserStore;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  option?: string;
}
