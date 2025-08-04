import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Param, Post, Put, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/request/create-role-dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { UpdateRoleDto } from './dto/request/update-role-dto';
import { UserNS } from '../../modules/users/interface/users';
import { Auth } from '../../decorators/http.decorators';
import { ResponseDeleteDto } from './dto/response/response-delete-dto';
import { DeleteRoleDto } from './dto/request/confirm-delete-role-dto';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(@Inject('IRoleService') private readonly roleService: RoleService) {}

  @Get('routes')
  @Auth([UserNS.Roles.ADMIN])
  getRoutes() {
    return this.roleService.getAllRouter();
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get()
  async getRole() {
    return await this.roleService.getAll();
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get(':id/permission')
  async getPermission(@Param('id') id: number) {
    return await this.roleService.getPermissionById(id);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Post()
  async createRole(@Body() dto: CreateRoleDto) {
    return await this.roleService.createRole(dto);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Put(':id')
  async updateRole(@Param('id') id: number, @Body() dto: UpdateRoleDto): Promise<SuccessResponseDto> {
    return await this.roleService.updateRole(id, dto);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<SuccessResponseDto | ResponseDeleteDto> {
    return await this.roleService.deleteRole(id);
  }

  @Auth(UserNS.ALL)
  @Post('confirm')
  async confirmDeleteRole(@Body() dto: DeleteRoleDto): Promise<SuccessResponseDto | ResponseDeleteDto> {
    return await this.roleService.comfirmDeleteRole(dto);
  }
}
