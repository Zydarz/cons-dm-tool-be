import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { MasterDataNS } from '../../../../modules/master-data/master-data';

export class MasterDataOptionDto {
  @ApiProperty()
  @IsString()
  dataType: MasterDataNS.MasterDataList;

  @ApiProperty()
  @IsNumber()
  countOptions: number;

  @ApiProperty()
  @IsString()
  code: MasterDataNS.MasterDataCodeList;
}
