import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';
import { CustomerNS } from '../../../../modules/customers/interfaces/customer';

export class CustomerFilterDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(CustomerNS.CustomerStatus)
  status?: CustomerNS.CustomerStatus;
}
