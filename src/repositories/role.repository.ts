import { Inject } from '@nestjs/common';
import { RoleNS } from '../modules/roles/interfaces/role';
import { default as RoleEntity } from '../entities/role.entity';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { isNil, omit } from 'lodash';
import { CreateRoleDto } from '../modules/roles/dto/request/create-role-dto';
import { Op, Sequelize } from 'sequelize';
import { FLAG_PROTECTED } from './../common/constants/unit';
import { default as UserEntity } from '../entities/users.entity';
export class RoleRepository implements RoleNS.IRoleRepository {
  constructor(@Inject(RoleEntity.name) private readonly roleEntity: typeof RoleEntity,
              @Inject(UserEntity.name) private readonly userEntity: typeof UserEntity,
            ) {}

  async getAll(): Promise<RoleEntity[]> {
    const role = await this.roleEntity.findAll();
    return role.toDtos();
  }

  async getRoleById(id: number): Promise<RoleEntity | null> {
    const role = await this.roleEntity.findByPk(id);
    return role;
  }

  async createRole(dto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.roleEntity.create({
      name: dto.name,
      allDivision: dto.allDivision,
      flag_protected: 0,
    });
    return role;
  }

  async updateRole(id: number, dto: CreateRoleDto): Promise<SuccessResponseDto> {
    const role = await this.roleEntity.findByPk(id);
    if (isNil(role)) {
      throw RoleNS.ERRORS.RoleNotFound;
    }
    let dataUpdate = {
      name: dto.name,
      allDivision: dto.allDivision,
    };
    if(role.flag_protected == FLAG_PROTECTED) {
      dataUpdate.name = role.name;
    }
    await role.update(dataUpdate);
    return new SuccessResponseDto(true);
  }

  async deleteRole(id: number): Promise<SuccessResponseDto> {
    const rows = await this.userEntity.findAll({
      where: {
        deletedAt: null,
        roleId: id,
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('roleId')), 'roleId']],
    });
    if(rows.length == 0) {
      await this.roleEntity.destroy({
        where: {
          [Op.and]: {
            id: id, 
            flag_protected:  { [Op.ne]: FLAG_PROTECTED },
          },
        }
      });
    }
    
    return new SuccessResponseDto(true);
  }
}
