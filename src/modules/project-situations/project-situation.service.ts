import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PageDto } from '../../common/dto/page.dto';
import { ProjectSituationDto } from './dtos/project-situation.dto';
import { CreateProjectSituationDtos, CreateProjectSituationDto } from './dtos/requests/create-project-situation.dto';
import { IProjectSituationRepository } from './interfaces/project-situation.repository.interface';
import { IProjectSituationService } from './interfaces/project-situation.service.interface';
import { GetAllProjectSituationDto } from './dtos/requests/get-project-situations.dto';
import { NotFoundProjectSituationErr, ProjectSituationInvalidErr } from './errors/project-situation.error';
import { EditProjectSituationDtos } from './dtos/requests/edit-project-situation.dto';
import { ProjectNS } from '../../modules/projects/interfaces/project';
import { UserNS } from '../../modules/users/interface/users';
import { forEach, includes, isEmpty, isNil } from 'lodash';
import { default as ProjectSituationEntity } from '../../entities/project-situation.entity';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';
import { FilterDto } from './dtos/requests/filter-project-situation.dto';
import { GroupBy } from '../../common/constants/group-by';
import { ProjectSituationAllDto, ProjectSituationFlag } from './dtos/responses/project-situation-group.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ProjectSituationResponseDto } from './dtos/responses/project-situation.response.dto';
import moment from 'moment';
import { IProjectSituationHistoryService } from 'modules/project-situation-history/interfaces/project-situation-history.service.interface';
import { updatedByProjectDto } from './dtos/responses/updated-by-project.response.dto';
import { projectSituationDetailDto } from './dtos/responses/project-situation-detail.response.dto';

@Injectable()
export class ProjectSituationService implements IProjectSituationService {
  constructor(
    @Inject('IProjectSituationRepository')
    private readonly projectSituationRepository: IProjectSituationRepository,

    @Inject('IProjectService')
    private readonly projectService: ProjectNS.IProjectService,

    @Inject('IUserService')
    private readonly userService: UserNS.IUserService,

    @Inject('IProjectSituationHistoryService')
    private readonly projectSituationHistoryService: IProjectSituationHistoryService,
  ) { }

  async getAll(dto: GetAllProjectSituationDto): Promise<PageDto<ProjectSituationDto>> {
    try {
      return await this.projectSituationRepository.getAll(dto);
    } catch (error) {
      throw new NotFoundProjectSituationErr();
    }
  }

  private async checkPM(projectId: number, username?: string): Promise<boolean> {
    const project = await this.projectService.detailProject(projectId);
    const userIds = project.pm ? JSON.parse(project.pm) : [];
    return userIds.includes(username);
  }

  async createProjectSituation(
    userId: string,
    role: UserNS.Roles,
    dto: CreateProjectSituationDtos,
    username?: string,
  ): Promise<ProjectSituationResponseDto[]> {
    const isPM = await this.checkPM(dto.createDto[0].projectId, username);
    let errMsg = 'create project situation invalid';
    if (isPM || role === UserNS.Roles.ADMIN) {
      try {
        const situation: ProjectSituationResponseDto[] = [];
        const count = await this.projectSituationRepository.getGroupMax();
        const index = !isNil(count[0].getDataValue('count')) ? parseFloat(count[0].getDataValue('count')) + 1 : 0;
        for (const dt of dto.createDto) {
          const project = await this.projectService.getProjectbyId(dt.projectId);
          if (isNil(project)) {
            errMsg = 'The project invalid';
            throw new ProjectSituationInvalidErr(errMsg);
          }

          const projectSituation = await this.projectSituationRepository.createProjectSituation(userId, dt, index);
          await this.projectSituationHistoryService.createProjectSituationHistory(projectSituation);
          const projectSituationHistories = await this.projectSituationHistoryService.getProjectSituationHistoryByProjectSituationId(projectSituation.id);

          const user = await this.userService.getUserById(userId);
          situation.push(new ProjectSituationResponseDto(projectSituation, user, project, projectSituationHistories));
        }
        return situation;
      } catch (error) {
        throw new ProjectSituationInvalidErr(errMsg);
      }
    }
    throw new ForbiddenException();
  }

  async deleteProjectSituation(
    id: number,
    flag: number,
    role: UserNS.Roles,
    del?: string,
    username?: string,
  ): Promise<boolean> {
    const projectSituation = await this.projectSituationRepository.findById(id);
    if (isNil(projectSituation)) {
      throw new NotFoundProjectSituationErr();
    }
    const isPM = await this.checkPM(projectSituation.projectId, username);
    if (isPM || role === UserNS.Roles.ADMIN) {
      try {
        if (del) {
          await this.projectSituationRepository.deleteProjectSituation(flag, id, del);
        } else {
          await this.projectSituationRepository.deleteProjectSituation(flag);
        }
        return true;
      } catch (error) {
        throw new ProjectSituationInvalidErr('delete project situation invalid');
      }
    }
    throw new ForbiddenException();
  }

  async editProjectSituation(
    userId: string,
    dto: EditProjectSituationDtos,
    role: UserNS.Roles,
    username?: string,
  ): Promise<ProjectSituationResponseDto[]> {
    let isPM = false;
    if (dto.editDto[0].id) {
      const projectSituation = await this.projectSituationRepository.findById(+dto.editDto[0].id);
      if (isNil(projectSituation)) {
        throw new NotFoundProjectSituationErr();
      }
      isPM = await this.checkPM(projectSituation.id, username);
    }
    const situationIds = await this.projectSituationRepository.getSituationByflag(dto.editDto[0].flag);
    const situation: ProjectSituationResponseDto[] = [];
    const id: number[] = [];
    let errMsg = 'create project situation invalid';
    if (isPM || role === UserNS.Roles.ADMIN) {
      try {
        for (const edit of dto.editDto) {
          // update project  situation
          if (edit.id) {
            id.push(edit.id);
            const projectSituation = await this.projectSituationRepository.findById(edit.id);
            const user = await this.userService.getUserById(userId);
            if (!projectSituation) {
              throw new NotFoundProjectSituationErr();
            }

            const project = await this.projectService.getProjectbyId(projectSituation.projectId);
            if (isNil(project)) {
              errMsg = 'The project invalid';
              throw new ProjectSituationInvalidErr(errMsg);
            }
            const count = await this.projectSituationRepository.getGroupMax();
            const index = !isNil(count[0].getDataValue('count')) ? parseFloat(count[0].getDataValue('count')) + 1 : 0;
            if (edit.note) {
              projectSituation.note = edit.note;
            }
            if (edit.date && !moment(projectSituation.date).isSame(edit.date)) {
              projectSituation.date = edit.date;
              projectSituation.flag = index;
            } else if (edit.date) {
              projectSituation.date = edit.date;
            }
            await projectSituation.save();
            const projectSituationCopy = JSON.parse(JSON.stringify(projectSituation));
            await this.projectSituationHistoryService.createProjectSituationHistory({ ...projectSituationCopy, submitterId: userId });
            const projectSituationHistories = await this.projectSituationHistoryService.getProjectSituationHistoryByProjectSituationId(projectSituation.id);
            situation.push(new ProjectSituationResponseDto(projectSituation, user, project, projectSituationHistories));
          }
          // add  project  situation
          if (edit.projectId && edit.date && edit.note) {
            const param: CreateProjectSituationDto = {
              projectId: edit.projectId,
              date: edit.date,
              note: edit.note,
            };
            const projectSituation = await this.projectSituationRepository.createProjectSituation(
              userId,
              param,
              edit.flag,
            );
            const user = await this.userService.getUserById(userId);
            await this.projectSituationHistoryService.createProjectSituationHistory(projectSituation);
            const project = await this.projectService.getProjectbyId(edit.projectId);
            const projectSituationHistories = await this.projectSituationHistoryService.getProjectSituationHistoryByProjectSituationId(projectSituation.id);

            situation.push(new ProjectSituationResponseDto(projectSituation, user, project, projectSituationHistories));
          }
        }
        // delete proejct situation
        if (!dto.edit) {
          const ids = situationIds.filter((s) => !id.includes(s));
          await this.projectSituationRepository.deleteSituationWhenEdit(dto.editDto[0].flag, ids);
        }
        return situation;
      } catch (error) {
        throw new ProjectSituationInvalidErr(errMsg);
      }
    }
    throw new ForbiddenException();
  }
  async lastSitualation(projectId: number): Promise<ProjectSituationEntity> {
    const projectSituation = await this.projectSituationRepository.getLastSitualation(projectId);
    const lastProjectSituation = projectSituation[0];
    return lastProjectSituation;
  }

  async deleteProjectSituationByProjectId(projectId: number, t?: Transaction | undefined): Promise<SuccessResponseDto> {
    return await this.projectSituationRepository.deleteProjectSituationByProjectId(projectId, t);
  }

  async getProjectSituationByGroup(
    filter: FilterDto,
  ): Promise<ProjectSituationAllDto[] | PageDto<ProjectSituationFlag>> {
    let projectSituationAll: ProjectSituationAllDto[] | PageDto<ProjectSituationFlag>;
    if (filter.groupBy === GroupBy.All) {
      let flags = await this.projectSituationRepository.getFlag(filter, 'all');
      const array = [...new Set(flags)];
      const { page, take } = filter;
      flags = array.filter((_, idx) => page * take - take <= idx && idx <= page * take - 1);
      let situationFlag = await Promise.all(
        flags.map(async (f) => {
          const situation = await this.projectSituationRepository.getSituationByFlag(f, filter);
          if (isEmpty(situation)) {
            return {} as ProjectSituationFlag;
          }
          return new ProjectSituationFlag(situation[0].date, situation, situation[0].submitter?.username, situation[0].updatedAt);
        }),
      );
      situationFlag = situationFlag.filter((s) => !isEmpty(s));
      const meta = new PageMetaDto(
        {
          pageOptionsDto: {
            page: filter.page,
            take: filter.take,
          } as PageOptionsDto,
          itemCount: situationFlag.length,
        },
        array.length,
      );
      projectSituationAll = new PageDto(situationFlag, meta);
    } else {
      const array = await this.projectSituationRepository.getArrayByGroup(filter);
      projectSituationAll = await Promise.all(
        array.map(async (arr) => {
          if (filter.groupBy === GroupBy.PROJECT) {
            const situation = await this.projectSituationRepository.getSituationByProjectId(arr, filter);
            const project = await this.projectService.getProjectbyId(arr);

            return new ProjectSituationAllDto(situation.length, situation, undefined, undefined, project);
          }

          const month = `${arr?.year}/${arr?.month}`;
          const flags = await this.projectSituationRepository.getFlag(filter, undefined, arr.month, arr.year);

          let count = 0;
          let situationFlag = await Promise.all(
            flags.map(async (f) => {
              const situation = await this.projectSituationRepository.getSituationByFlag(f, filter);
              count += situation.length;
              if (!isEmpty(situation)) {
                return new ProjectSituationFlag(situation[0].date, situation, situation[0].submitter?.username, situation[0].updatedAt);
              }
              return {} as ProjectSituationFlag;
            }),
          );
          situationFlag = situationFlag.filter((s) => !isEmpty(s));
          return new ProjectSituationAllDto(count, undefined, situationFlag, month, undefined);
        }),
      );
    }
    return projectSituationAll;
  }
  async getUpdatedByProject(projectId: number): Promise<updatedByProjectDto[]> {
    let paramsSituation: any = new GetAllProjectSituationDto;
    paramsSituation.projectId = projectId;
    const projectSituation = await this.projectSituationRepository.getUpdatedByProject(projectId);
    let updatedSituation: updatedByProjectDto[] = [];
    let listDate: any[] = [];
    let projectSituationByDate: any[] = [];
    projectSituation?.forEach((situation: any) => {
      if (!projectSituationByDate.hasOwnProperty(situation.date)) {
        projectSituationByDate[situation.date] = [{
          id: situation.id,
          num: 1,
          situation: situation
        }];
      } else {
        projectSituationByDate[situation.date].push({
          id: situation.id,
          num: projectSituationByDate[situation.date].length + 1,
          situation: situation
        });
      }
    })
    projectSituation?.forEach((situation: any, index) => {
      let name = moment(situation.date).format('YYYY/MM/DD');
      if (projectSituationByDate[situation.date].length > 1) {
        projectSituationByDate[situation.date].forEach((sD: any) => {
          if (situation.id == sD.id) {
            name = name + ' (' + sD.num + ')';
          }
        })
      }
      updatedSituation.push({
        id: situation.id,
        name: name,
        date: situation.date,
        updatedAt: situation.updatedAt,
      });
    })
    return updatedSituation;
  }
  async getProjectSituationbyId(id: number): Promise<projectSituationDetailDto> {
    const projectSituation = await this.projectSituationRepository.getSituationById(id);
    if (isNil(projectSituation)) {
      return {} as projectSituationDetailDto;
    }
    return projectSituation;
  }
}
