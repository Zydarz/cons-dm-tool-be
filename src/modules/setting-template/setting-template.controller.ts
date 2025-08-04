import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { UserNS } from '../users/interface/users';
import { SettingTemplateDto } from './dto/responses/setting-template.dto';
import { TemplateFilterDto } from './dto/requests/template-filter.dto';
import { CreateTemplateDto } from './dto/requests/create-template.dto';
import { UpdateTemplateDto } from './dto/requests/update-template.dto';
import { SettingTemplateNS } from './interface/setting-template';
import { SuccessResponseDto } from './../../common/dto/success.response.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';

@ApiTags('Setting Template')
@Controller('setting-template')
export class SettingTemplateController {
  constructor(@Inject('ISettingTemplateService') private readonly settingTemplateService: SettingTemplateNS.ISettingTemplateService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getTemplates(
    @Query() params: TemplateFilterDto,
  ): Promise<SettingTemplateDto[]> {
    return await this.settingTemplateService.getTemplates(params);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async createUser(
    @AuthUser() user: UserEntity,
    @Body() params: CreateTemplateDto ): Promise<SettingTemplateDto> {
    return this.settingTemplateService.createTemplate(params, user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  getUserByID(@Param('id') id: number): Promise<SettingTemplateDto | null> {
    return this.settingTemplateService.getTemplate(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  updateUser(
    @AuthUser() user: UserEntity,
    @Param('id') id: number,
    @Body() param: UpdateTemplateDto): Promise<SettingTemplateDto> {
    return this.settingTemplateService.updateTemplate(id, param, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  deleteUser(@Param('id') id: number): Promise<SuccessResponseDto> {
    return this.settingTemplateService.deleteTemplate(id);
  }

}
