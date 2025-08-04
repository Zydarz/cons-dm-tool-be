import { SettingTemplateDto } from '../dto/responses/setting-template.dto';
import { TemplateFilterDto } from '../dto/requests/template-filter.dto';
import { CreateTemplateDto } from '../dto/requests/create-template.dto';
import { UpdateTemplateDto } from '../dto/requests/update-template.dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
export namespace SettingTemplateNS {

  export interface ISettingTemplateService {
    getTemplates(params: TemplateFilterDto): Promise<SettingTemplateDto[]>;
    getTemplate(templateId: number): Promise<SettingTemplateDto | null>;
    createTemplate(params: CreateTemplateDto, userId: string): Promise<SettingTemplateDto>;
    updateTemplate(templateId: number, params: UpdateTemplateDto, userId: string): Promise<SettingTemplateDto>;
    deleteTemplate(templateId: number): Promise<SuccessResponseDto>;
  }

  export interface ISettingTemplateRepository {
    getTemplates(params: TemplateFilterDto): Promise<SettingTemplateDto[]>;
    getTemplate(templateId: number): Promise<SettingTemplateDto | null>;
    createTemplate(params: CreateTemplateDto, userId: string): Promise<SettingTemplateDto>;
    updateTemplate(templateId: number, params: UpdateTemplateDto, userId: string): Promise<SettingTemplateDto>;
    deleteTemplate(templateId: number): Promise<SuccessResponseDto>;
  }

  // 'Situation','Mail','Message','Notify'
  export enum TemplateTypes {
    SITUATION = 'Situation',
    Mail = 'Mail',
    MESSAGE = 'Message',
    NOTIFY = 'Notify',
  }

  export const errMsg = {
    TemplateNotFound: new NotFoundException('Template Not Found'),
    TemplateExisted: new ConflictException('Template Existed'),
  };
}
