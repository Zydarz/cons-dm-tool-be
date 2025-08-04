import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { MasterDataNS } from '../../../../modules/master-data/master-data';
import { CreateMasterDataDto } from './create-master-data.dto';
import { DeleteMasterDataDto } from './delete-master-data.dto';
import { UpdateMasterDataDto } from './update-master-data.dto';

export class HandleMasterDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: MasterDataNS.MasterDataCodeList;

  @ApiPropertyOptional({ type: [CreateMasterDataDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMasterDataDto)
  createdData: CreateMasterDataDto[];

  @ApiPropertyOptional({ type: [UpdateMasterDataDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMasterDataDto)
  updatedData: UpdateMasterDataDto[];

  @ApiPropertyOptional({ type: [DeleteMasterDataDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeleteMasterDataDto)
  deletedData: DeleteMasterDataDto[];
}
