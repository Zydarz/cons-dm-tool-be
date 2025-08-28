import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min, Max, Length } from 'class-validator';
import { ProjectNS } from '../../interfaces/project';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @Length(1, 30)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(1, 30)
  am: string;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: ProjectNS.Type;

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
  @IsNumber()
  @IsOptional()
  contractTypeId: number;

  @ApiPropertyOptional()
  @IsNumber()
  departmentId: number;

  @ApiProperty()
  @IsString()
  currency: ProjectNS.Currency;

  @ApiProperty()
  @IsString()
  status: ProjectNS.Status;

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
  @Min(1)
  statusBidding?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  statusDevelopment?: number;
}