import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';
import { UserNS } from '../../../../modules/users/interface/users';

export class GetSalaryDto extends PageOptionsDto {

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  userIds?: string[];

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  lineIds?: string[];

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  divisionIds?: string[];

  @ApiPropertyOptional()
  @IsEnum(UserNS.Status)
  @IsOptional()
  status?: UserNS.Status;

  @ApiPropertyOptional()
  @IsEnum(UserNS.Type)
  @IsOptional()
  type?: UserNS.Type;

  @ApiPropertyOptional()
  @IsOptional()
  flagOnsite?: string;
}
