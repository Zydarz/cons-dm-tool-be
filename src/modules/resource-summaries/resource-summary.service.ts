import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateResourceDto } from '../../modules/resources/dto/requests/create-resource-dto';
import { TotalResourceProjectDto } from './dtos/responses/total-resource-summary.dto';
import { IResourceSummaryRepository } from './interfaces/resource-summary.repository.interface';
import { IResourceSummaryService } from './interfaces/resource-summary.service.interface';
import moment from 'moment';
import { default as ResourceSummaryEntity } from '../../entities/resource-summary.entity';
import { NotFoundResourceSummary, ResourceSummaryInvalidErr } from './errors/resource-summary.error';
import { ResourceSummaryDto } from './dtos/resource-summary.dto';
import { DiffAcAndTcPercentInterface } from './interfaces/diff-ac-and-tc-percent.interface';
import { UpdateResourceSummaryWhenEditLogworkDto } from './dtos/requests/update-when-edit-log-work.dto';
import { UpdateResourceSummaryDto } from './dtos/requests/update-resource-summary.dto';
import { AcAndTcPercentTotalDto } from '../resources/dto/responses/ac-tc-percent-total-dto';
import { MAN_MONTH_HOUR, MAN_MONTH_PERCENT } from '../../common/constants/unit';
import { UpdateResourceSummaryType } from './dtos/enum';
import { ProjectsService } from '../../modules/projects/projects.service';
import { default as UserEntity } from '../../entities/users.entity';
import { UserNS } from '../../modules/users/interface/users';
import { ResourceNS } from '../../modules/resources/interfaces/resource';
import { ResourceSummaryMonth } from './dtos/responses/resource-summary-month.dto';
import { isNil } from 'lodash';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';
import { CreateResourceSummaryDto } from './dtos/requests/create-resource-summary.dto';

@Injectable()
export class ResourceSummaryService implements IResourceSummaryService {
  constructor(
    @Inject('IResourceSummaryRepository')
    private readonly resourceSummaryRepo: IResourceSummaryRepository,

    @Inject('IProjectService')
    private readonly projectService: ProjectsService,

    @Inject(forwardRef(() => 'IResourceService'))
    private readonly resourceService: ResourceNS.IResourceService,
  ) {}
  async getAll(projectId: number): Promise<ResourceSummaryEntity[]> {
    try {
      return await this.resourceSummaryRepo.getAll(projectId);
    } catch (error) {
      throw new NotFoundResourceSummary();
    }
  }

  async getAllMonth(projectId: number): Promise<ResourceSummaryMonth[]> {
    try {
      const docs = await this.resourceSummaryRepo.getAll(projectId);
      
      return await Promise.all(
        docs.map(async (d) => {
          const startDate = moment(new Date(`${d.year}-${d.month}-01`)).toDate();
          const endDate = moment(new Date(`${d.year}-${d.month}-01`))
            .endOf('month')
            .toDate();
          const acTC = await this.resourceService.getResourceTotal(startDate, endDate, projectId);
          return new ResourceSummaryMonth(
            d.month,
            d.year,
            d.committedTotal,
            Math.round((acTC[0].acPercentTotal / MAN_MONTH_PERCENT) * 100) / 100,
            Math.round((acTC[0].tcPercentTotal / MAN_MONTH_PERCENT) * 100) / 100,
          );
        }),
      );
    } catch (error) {
      
      console.log('error',error);
      throw new NotFoundResourceSummary();
    }
  }

  async getAllSummary(projectId: number): Promise<ResourceSummaryDto[]> {
    try {
      const summary = await this.resourceSummaryRepo.getAllSummary(projectId);
      return summary.toDtos();
    } catch (error) {
      throw new NotFoundResourceSummary();
    }
  }

  async getToTalResourceProject(projectId: number): Promise<TotalResourceProjectDto> {
    try {
      return await this.resourceSummaryRepo.getToTalResourceProject(projectId);
    } catch (error) {
      throw new ResourceSummaryInvalidErr('get resource summary is not success !');
    }
  }

  async createResourceSummaryWhenAddResource(createResourceDto: CreateResourceDto): Promise<boolean> {
    try {
      const dataObj: Record<string, { acPercent: number; tcPercent: number }> = {};
      createResourceDto.resources.forEach((resource) => {
        const projectId = resource.projectId;
        const mStartDate = moment(resource.startDate);
        const mEndDate = moment(resource.endDate);
        const diffDay = mEndDate.diff(mStartDate, 'days');
        for (let i = 0; i <= diffDay; i++) {
          const month = mStartDate.format('MM');
          const year = mStartDate.format('YYYY');
          const key = `${month}-${year}-${projectId}`;
          const day = mStartDate.day();
          if (![0, 6].includes(day)) {
            if (!dataObj[key]) {
              dataObj[key] = {
                acPercent: 0,
                tcPercent: 0,
              };
            }
            dataObj[key].acPercent += resource.acPercent;
            dataObj[key].tcPercent += resource.tcPercent;
          }
          mStartDate.add(1, 'day');
        }
      });
      const dataKeyArr = Object.keys(dataObj);
      for (const dataKey of dataKeyArr) {
        const [month, year, projectId] = dataKey.split('-').map(Number);
        let resourceSummary = await this.resourceSummaryRepo.getResourceSummary(projectId, year, month);
        if (!resourceSummary) {
          resourceSummary = new ResourceSummaryEntity();
          resourceSummary.projectId = projectId;
          resourceSummary.month = month;
          resourceSummary.year = year;
          resourceSummary.allocated = 0;
          resourceSummary.temporaryAdded = 0;
        }
        resourceSummary.allocated += dataObj[dataKey].acPercent / 2000;
        resourceSummary.temporaryAdded = dataObj[dataKey].tcPercent / 2000;
        await resourceSummary.save();
      }
      return true;
    } catch (error) {
      throw new ResourceSummaryInvalidErr('create resource summary is not success !');
    }
  }

  async updateResourceSummaryWhenEditResource(diffAcAndTcPercent: DiffAcAndTcPercentInterface): Promise<boolean> {
    try {
      await Promise.all(
        Object.keys(diffAcAndTcPercent).map(async (key) => {
          const [month, year, projectId] = key.split('-').map((str) => Number(str));
          let resourceSummary = await this.resourceSummaryRepo.getResourceSummary(projectId, year, month);
          if (!resourceSummary) {
            resourceSummary = new ResourceSummaryEntity();
            resourceSummary.projectId = projectId;
            resourceSummary.month = month;
            resourceSummary.year = year;
            resourceSummary.allocated = 0;
          }
          resourceSummary.allocated += diffAcAndTcPercent[key].acPercentDiff / 2000;
          resourceSummary.temporaryAdded += diffAcAndTcPercent[key].tcPercentDiff / 2000;
          return await resourceSummary.save();
        }),
      );
      return true;
    } catch (error) {
      throw new ResourceSummaryInvalidErr('update resource summary is not success !');
    }
  }

  async addResourceSummaryWhenAddLogWork(reportDate: Date, actualEffort: number, projectId: number): Promise<void> {
    try {
      const workDay = moment(reportDate).format('YYYY-MM');
      const [year, month] = workDay.split('-').map(Number);
      const resourceSummary =
        (await this.resourceSummaryRepo.getResourceSummary(projectId, year, month)) ?? new ResourceSummaryEntity();
      resourceSummary.projectId = projectId;
      resourceSummary.year = year;
      resourceSummary.month = month;
      resourceSummary.actual += actualEffort / MAN_MONTH_HOUR;
      await resourceSummary.save();
    } catch (error) {
      throw new ResourceSummaryInvalidErr('create resource summary is not success !');
    }
  }

  async updateResourceSummaryWhenEditLogwork(dto: UpdateResourceSummaryWhenEditLogworkDto): Promise<void> {
    try {
      const reportDateBefore = dto.reportDateBefore ? moment(dto.reportDateBefore).format('YYYY-MM') : '';
      const reportDateAfter = dto.reportDateAfter ? moment(dto.reportDateAfter).format('YYYY-MM') : '';
      if (reportDateBefore === reportDateAfter) {
        const [year, month] = reportDateBefore.split('-').map(Number);
        const resourceSummary = await this.resourceSummaryRepo.getResourceSummary(dto.projectId, year, month);
        if (!resourceSummary) {
          throw new NotFoundResourceSummary();
        }
        resourceSummary.actual += (dto.actualEffortAfter - dto.actualEffortBefore) / MAN_MONTH_HOUR;
        await resourceSummary.save();
      } else {
        const [yearBefore, monthBefore] = reportDateBefore.split('-').map(Number);
        const [yearAfter, monthAfter] = reportDateAfter.split('-').map(Number);
        const resourceSummaryBefore = await this.resourceSummaryRepo.getResourceSummary(
          dto.projectId,
          yearBefore,
          monthBefore,
        );
        const resourceSummaryAfter = await this.resourceSummaryRepo.getResourceSummary(
          dto.projectId,
          yearAfter,
          monthAfter,
        );
        if (!resourceSummaryBefore || !resourceSummaryAfter) {
          throw new NotFoundResourceSummary();
        }
        resourceSummaryBefore.actual -= dto.actualEffortBefore;
        await resourceSummaryBefore.save();
        resourceSummaryAfter.actual += dto.actualEffortAfter;
        await resourceSummaryAfter.save();
      }
    } catch (error) {
      throw new ResourceSummaryInvalidErr('update resource summary is not success !');
    }
  }
  async updateResourceSummaryWhenDeleteLogwork(
    month: number,
    year: number,
    projectId: number,
    actual: number,
  ): Promise<void> {
    try {
      const resourceSummary = await this.resourceSummaryRepo.getResourceSummary(projectId, year, month);
      if (!resourceSummary) {
        throw new NotFoundResourceSummary();
      }
      resourceSummary.actual -= actual / MAN_MONTH_HOUR;
      await resourceSummary.save();
    } catch (error) {
      throw new ResourceSummaryInvalidErr('delete resource summary is not success !');
    }
  }

  async updateResourceSummary(dto: UpdateResourceSummaryDto, user: UserEntity): Promise<ResourceSummaryDto> {
    try {
      const { projectId, month, year, commited } = dto;
      const project = await this.projectService.detailProject(projectId);
      const userIds = project.pm ? JSON.parse(project.pm) : [];
      if (userIds.includes(user.username) || user.role === UserNS.Roles.ADMIN) {
        const resourceSummary = await this.resourceSummaryRepo.getResourceSummary(projectId, year, month);
        if (!resourceSummary) {
          throw new NotFoundResourceSummary();
        }
        if (isNil(commited)) {
          throw new ResourceSummaryInvalidErr('committed is not empty !');
        }
        resourceSummary.committed = commited;
        resourceSummary.committerId = user.id;
        await resourceSummary.save();
        return resourceSummary.toDto();
      }
      throw new ForbiddenException();
    } catch (error) {
      throw new ResourceSummaryInvalidErr('update resource summary is not success !');
    }
  }

  async updateResourceSummaryWhenAddResource(
    projectId: number,
    month: number,
    year: number,
    acAndTcTotal: AcAndTcPercentTotalDto,
    type: UpdateResourceSummaryType,
  ): Promise<boolean> {
    try {
      let resourceSummary = await this.resourceSummaryRepo.getResourceSummary(projectId, year, month);
      if (!resourceSummary) {
        resourceSummary = new ResourceSummaryEntity();
        resourceSummary.projectId = projectId;
        resourceSummary.month = month;
        resourceSummary.year = year;
        resourceSummary.allocated = 0;
        resourceSummary.temporaryAdded = 0;
      }
      if (type === UpdateResourceSummaryType.SUBTRACT) {
        resourceSummary.allocated -= acAndTcTotal.acPercentTotal / MAN_MONTH_PERCENT;
        resourceSummary.temporaryAdded -= acAndTcTotal.tcPercentTotal / MAN_MONTH_PERCENT;
        if (resourceSummary.allocated < 0) {
          resourceSummary.allocated = 0;
        }
        if (resourceSummary.temporaryAdded < 0) {
          resourceSummary.temporaryAdded = 0;
        }
      } else {
        resourceSummary.allocated += acAndTcTotal.acPercentTotal / MAN_MONTH_PERCENT;
        resourceSummary.temporaryAdded += acAndTcTotal.tcPercentTotal / MAN_MONTH_PERCENT;
      }
      await resourceSummary.save();
      return true;
    } catch (error) {
      throw new ResourceSummaryInvalidErr();
    }
  }
  async getCommittedAlocated(projectIds: number, date: Date): Promise<TotalResourceProjectDto> {
    return await this.resourceSummaryRepo.getToTalResourceProjects(projectIds, date);
  }

  async createResourcesSummary(createDto: CreateResourceSummaryDto): Promise<ResourceSummaryDto> {
    return await this.resourceSummaryRepo.createResourceSummary(createDto);
  }

  async deleteResourceSummaryByProjectId(projectId: number, t?: Transaction | undefined): Promise<SuccessResponseDto> {
    return await this.resourceSummaryRepo.deleteResourceSummaryByProjectId(projectId, t);
  }
}
