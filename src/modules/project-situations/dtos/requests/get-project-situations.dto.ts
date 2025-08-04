import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';

export class GetAllProjectSituationDto extends PageOptionsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
