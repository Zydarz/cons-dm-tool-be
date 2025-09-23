import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { ProjectNS } from '../../interfaces/project';

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Length(1, 250)
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Length(1, 30)
  am?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  contractTypeId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDateActual?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDateActual?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: ProjectNS.Currency;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: ProjectNS.Status;

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 9 })
  @IsOptional()
  @Max(9999999999)
  @Min(0)
  billable?: number;

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 9 })
  @IsOptional()
  @Max(9999999999)
  @Min(0)
  budget?: number;

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 9 })
  @IsOptional()
  @Max(9999999999)
  @Min(0)
  internalPrice?: number;

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 9 })
  @IsOptional()
  @Max(9999999999)
  @Min(0)
  externalPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channelId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groupId?: string;

  // Các trường mới được thêm
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 255)
  backLogId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  techStack?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  market?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  statusBidding?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  statusDevelopment?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 255)
  application?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  budgetCustomer?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  feedbackDate?: Date;
}