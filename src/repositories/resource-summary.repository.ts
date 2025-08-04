import { Inject } from '@nestjs/common';
import { default as ResourceSummaryEntity } from '../entities/resource-summary.entity';
import { IResourceSummaryRepository } from '../modules/resource-summaries/interfaces/resource-summary.repository.interface';
import { col, fn, Op, Transaction } from 'sequelize';
import { CreateResourceSummaryDto } from '../modules/resource-summaries/dtos/requests/create-resource-summary.dto';
import { ResourceSummaryDto } from '../modules/resource-summaries/dtos/resource-summary.dto';
import { UpdateResourceSummaryDto } from '../modules/resource-summaries/dtos/requests/update-resource-summary.dto';
import { TotalResourceProjectDto } from '../modules/resource-summaries/dtos/responses/total-resource-summary.dto';
import moment from 'moment';
import { SuccessResponseDto } from '../common/dto/success.response.dto';

export class ResourceSummaryRepository implements IResourceSummaryRepository {
  constructor(
    @Inject(ResourceSummaryEntity.name) private readonly resourceSummaryEntity: typeof ResourceSummaryEntity,
  ) {}

  async getAll(projectId: number): Promise<ResourceSummaryEntity[]> {
    return await this.resourceSummaryEntity.findAll({
      attributes: [
        'year',
        'month',
        [fn('SUM', col('committed')), 'committedTotal'],
        [fn('SUM', col('allocated')), 'allocatedTotal'],
        [fn('SUM', col('temporaryAdded')), 'temporaryAddedTotal'],
      ],
      where: { projectId },
      group: ['year', 'month'],
      raw: true,
    });
  }

  async getAllSummary(projectId: number): Promise<ResourceSummaryEntity[]> {
    const result = await this.resourceSummaryEntity.findAll({
      where: { projectId },
    });
    return result;
  }
  async getToTalResourceProject(projectId: number): Promise<TotalResourceProjectDto> {
    const totalResourceArr = await this.resourceSummaryEntity.findAll({
      attributes: [
        [fn('SUM', col('committed')), 'committedTotal'],
        [fn('SUM', col('allocated')), 'allocatedTotal'],
        [fn('SUM', col('temporaryAdded')), 'temporaryAddedTotal'],
        [fn('SUM', col('actual')), 'actualTotal'],
      ],
      where: { projectId },
      raw: true,
    });
    const { committedTotal, allocatedTotal, temporaryAddedTotal, actualTotal } = totalResourceArr[0];
    return new TotalResourceProjectDto(committedTotal, allocatedTotal, temporaryAddedTotal, actualTotal);
  }

  async createResourceSummary(dto: CreateResourceSummaryDto): Promise<ResourceSummaryDto> {
    const resourceSummary = await this.resourceSummaryEntity.create({ ...dto });
    return resourceSummary.toDto();
  }

  async updateResourceSummarary(dto: UpdateResourceSummaryDto): Promise<ResourceSummaryDto> {
    const updateResourceSummary = await this.resourceSummaryEntity.update(
      {
        ...dto,
      },
      {
        where: {
          projectId: dto.projectId,
          year: dto.year,
          month: dto.month,
        },
        returning: true,
      },
    );
    return updateResourceSummary[1][0].toDto();
  }

  async getResourceSummary(projectId: number, year: number, month: number): Promise<ResourceSummaryEntity | null> {
    return await this.resourceSummaryEntity.findOne({
      where: {
        projectId,
        year,
        month,
      },
    });
  }
  async getToTalResourceProjects(projectIds: number, date: Date): Promise<TotalResourceProjectDto> {
    const month = moment(date).month();
    const year = moment(date).year();
    const totalResourceArr = await this.resourceSummaryEntity.findAll({
      attributes: [
        [fn('SUM', col('committed')), 'committedTotal'],
        [fn('SUM', col('allocated')), 'allocatedTotal'],
        [fn('SUM', col('temporaryAdded')), 'temporaryAddedTotal'],
        [fn('SUM', col('actual')), 'actualTotal'],
      ],
      where: {
        [Op.and]: {
          month: month + 1,
          year,
          projectId: projectIds,
        },
      },
      raw: true,
    });
    const { committedTotal, allocatedTotal, temporaryAddedTotal, actualTotal } = totalResourceArr[0];
    return new TotalResourceProjectDto(committedTotal, allocatedTotal, temporaryAddedTotal, actualTotal);
  }

  async deleteResourceSummaryByProjectId(projectId: number, t?: Transaction | undefined): Promise<SuccessResponseDto> {
    await this.resourceSummaryEntity.destroy({
      where: {
        projectId,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }
}
