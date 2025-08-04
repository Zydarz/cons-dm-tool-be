import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';
import { default as UserEntity } from '../../../../entities/users.entity';
import { UserDto } from '../../../users/dto/response/user-dto';
import { AcTcMdPercentTotalDto } from './ac-tc-md-total-dto';
import { ProjectResourceSummaryDto } from './project-resource-summar-dto';
export type UserResourceAllocatelDtoOptions = Partial<{ projectAllocate: ProjectResourceSummaryDto[] }>;
export class UserResourceSummaryDto extends UserDto {
  @ApiPropertyOptional()
  @Min(0)
  @Max(100)
  ac: number;

  @ApiPropertyOptional()
  @Min(0)
  @Max(100)
  tc: number;

  @ApiProperty()
  acPer: number;

  @ApiProperty()
  tcPer: number;

  @ApiProperty()
  totalMD: number;

  @ApiPropertyOptional()
  allocates?: ProjectResourceSummaryDto[];

  constructor(user: UserEntity, compute: AcTcMdPercentTotalDto, options?: UserResourceAllocatelDtoOptions) {
    super(user);
    this.ac = compute.acPercentTotal;
    this.tc = compute.tcPercentTotal;
    this.acPer = compute.acPercent;
    this.tcPer = compute.tcPercent;
    this.totalMD = compute.totalMD;
    this.allocates = options?.projectAllocate;
  }
}
