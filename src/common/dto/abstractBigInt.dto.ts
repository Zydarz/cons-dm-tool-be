import { ApiProperty } from '@nestjs/swagger';
import { AbstractWithBigIntIDEntity } from '../abstractWithBigIntergerID.entity';
export class AbstractBigDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: AbstractWithBigIntIDEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
