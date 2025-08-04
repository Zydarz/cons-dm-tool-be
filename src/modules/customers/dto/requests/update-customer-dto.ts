import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { TrimStartAndEnd } from '../../../../decorators/transforms.decorator';
import { CustomerNS } from '../../../../modules/customers/interfaces/customer';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  @TrimStartAndEnd()
  @IsNotEmpty()
  readonly name?: string;

  @ApiPropertyOptional({ type: Date })
  @IsDateString()
  @IsOptional()
  readonly firstContactDate?: Date;

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
  @IsOptional()
  @IsEnum(CustomerNS.CustomerStatus)
  readonly status?: CustomerNS.CustomerStatus;
}
