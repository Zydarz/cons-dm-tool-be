import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class InformationProjectRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  projectId: string;
}
