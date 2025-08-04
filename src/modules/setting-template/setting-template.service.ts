import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { SettingTemplateDto } from './dto/responses/setting-template.dto';
import { TemplateFilterDto } from './dto/requests/template-filter.dto';
import { CreateTemplateDto } from './dto/requests/create-template.dto';
import { UpdateTemplateDto } from './dto/requests/update-template.dto';
import { SettingTemplateNS } from './interface/setting-template';
import { SuccessResponseDto } from './../../common/dto/success.response.dto';

@Injectable()
export class SettingTemplateService implements SettingTemplateNS.ISettingTemplateService {
  constructor(@Inject('ISettingTemplateRepository') readonly settingTemplateRepository: SettingTemplateNS.ISettingTemplateRepository) {}

  async getTemplates(params: TemplateFilterDto): Promise<SettingTemplateDto[]> {
    let templates = await this.settingTemplateRepository.getTemplates(params);
    return templates;
  }

  async createTemplate(parrams: CreateTemplateDto, userId: string): Promise<SettingTemplateDto> {
    return await this.settingTemplateRepository.createTemplate(parrams, userId);
  }

  async getTemplate(templateId: number): Promise<SettingTemplateDto | null> {
    let template = await this.settingTemplateRepository.getTemplate(templateId);
    return template;
  }

  async updateTemplate(templateId: number, parrams: UpdateTemplateDto, userId: string): Promise<SettingTemplateDto> {
    return await this.settingTemplateRepository.updateTemplate(templateId, parrams, userId);
  }

  async deleteTemplate(templateId: number): Promise<SuccessResponseDto> {
    return await this.settingTemplateRepository.deleteTemplate(templateId);
  }
}
