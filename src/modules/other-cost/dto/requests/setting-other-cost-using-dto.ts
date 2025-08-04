import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { default as OtherCostEntity } from '../../../../entities/other-cost.entity';

export class SettingOtherCostUsingDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  settingOtherCostId: number;

  constructor(
    entity: OtherCostEntity,
  ) {
    this.id = entity.id;
    this.settingOtherCostId = entity.settingOtherCostId;
  }
}
