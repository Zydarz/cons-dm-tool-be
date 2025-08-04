import { isNil } from 'lodash';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { default as SettingTemplateEntity } from '../entities/setting_template.entity';
import { SettingTemplateNS } from '../modules/setting-template/interface/setting-template';
import { TemplateFilterDto } from 'modules/setting-template/dto/requests/template-filter.dto';
import { CreateTemplateDto } from 'modules/setting-template/dto/requests/create-template.dto';
import { SettingTemplateDto } from 'modules/setting-template/dto/responses/setting-template.dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
export class SettingTemplateRepository implements SettingTemplateNS.ISettingTemplateRepository {
  constructor(@Inject('SettingTemplateEntity') private readonly settingTemplateEntity: typeof SettingTemplateEntity) {}
  async getTemplates(params: TemplateFilterDto): Promise<SettingTemplateDto[]> {
    const condition = {};

    if (isNil(params.type)) {
      Object.assign(params, {
        type: 'Situation',
      });
    }
    if (!isNil(params.title)) {
      Object.assign(condition, {
        title: { [Op.like]:  [`%${params.title}%`] },
      });
    }
    Object.assign(condition, {
      type: params.type,
    });
    const template = await this.settingTemplateEntity.findAll({
      where: condition,
      order: [['updatedAt', 'DESC']],
    });
    return template.toDtos();
  }
  async createTemplate(param: CreateTemplateDto, userUpdateId: string): Promise<SettingTemplateDto> {
    const template = await this.settingTemplateEntity.create({
      title: param.title,
      type: param.type??SettingTemplateNS.TemplateTypes.SITUATION,
      content: param.content,
      userUpdateId: userUpdateId
    });
    return template;
  }
  async getTemplate(templateId: number): Promise<SettingTemplateDto | null> {
    const template = await this.settingTemplateEntity.findByPk(templateId);
    if(!isNil(template)) {
      return template.toDto();
    }
    return null;
  }
  async updateTemplate(templateId: number, param: CreateTemplateDto, userUpdateId: string): Promise<SettingTemplateDto> {
    const template = await this.settingTemplateEntity.findByPk(templateId);
    if (isNil(template)) {
      throw SettingTemplateNS.errMsg.TemplateNotFound;
    }

    await template.update({
      title: param.title,
      content: param.content,
      userUpdateId: userUpdateId
    });
    return template.toDto();
  }

  async deleteTemplate(templateId: number): Promise<SuccessResponseDto> {
    const template = await this.settingTemplateEntity.findByPk(templateId);
    if (isNil(template)) {
      return new SuccessResponseDto(false);
    }
    await template.destroy();
    return new SuccessResponseDto(true);
  }
}
