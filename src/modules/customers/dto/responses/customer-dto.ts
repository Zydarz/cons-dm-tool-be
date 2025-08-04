import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CustomerNS } from '../../../../modules/customers/interfaces/customer';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as CustomerEntity } from '../../../../entities/customer.entity';

export class CustomerDto extends AbstractDto {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: CustomerNS.CustomerStatus })
  status: CustomerNS.CustomerStatus;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  contactInfo?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  contactPoint?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  note?: string;

  @ApiProperty({ type: Date })
  firstContactDate: Date;

  @ApiProperty({ type: Date })
  deletedAt?: Date;

  constructor(customer: CustomerEntity) {
    super(customer);
    this.name = customer.name;
    this.contactInfo = customer.contactInfo;
    this.contactPoint = customer.contactPoint;
    this.note = customer.note;
    this.status = customer.status;
    this.firstContactDate = customer.firstContactDate;
    this.deletedAt = customer.deletedAt;
  }
}
