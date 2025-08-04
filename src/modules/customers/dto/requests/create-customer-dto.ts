import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { CustomerNS } from '../../../../modules/customers/interfaces/customer';
import { TrimStartAndEnd } from '../../../../decorators/transforms.decorator';

export class CreateCustomerDto {
  @ApiProperty({ type: String })
  @IsString()
  @TrimStartAndEnd()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  readonly firstContactDate: Date;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  @TrimStartAndEnd()
  readonly contactPoint?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  @TrimStartAndEnd()
  readonly contactInfo?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  @TrimStartAndEnd()
  readonly note?: string;

  @ApiProperty()
  @IsEnum(CustomerNS.CustomerStatus)
  readonly status: CustomerNS.CustomerStatus;
}
