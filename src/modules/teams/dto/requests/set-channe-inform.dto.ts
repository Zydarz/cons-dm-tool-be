import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SetChannelInformDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  projectId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channelId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  groupId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  projectName: string;
}

export class SetChannelInformDtos {
  @ApiPropertyOptional({ type: [SetChannelInformDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SetChannelInformDto)
  data: SetChannelInformDto[];
}
