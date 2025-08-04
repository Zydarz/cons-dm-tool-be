import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserResourceSummaryDto } from '../../modules/resources/dto/responses/user-resource-summary-dto';
import { TotalUserSummaryDto } from './total-user-summary.dto';

export class UserResourceSummaryResponseDto {
  @ApiPropertyOptional()
  data: UserResourceSummaryDto[];

  @ApiPropertyOptional()
  total: TotalUserSummaryDto;
  constructor(userRes: UserResourceSummaryDto[], total: TotalUserSummaryDto) {
    this.data = userRes;
    this.total = total;
  }
}
