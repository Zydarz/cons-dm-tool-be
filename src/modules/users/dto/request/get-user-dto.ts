import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';

export class GetUserDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly displayName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly mail?: string;

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  userIds?: string[];

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  readonly lineIds?: string[];
}
