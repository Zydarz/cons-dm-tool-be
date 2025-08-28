import { Inject } from '@nestjs/common';
import { default as ContractTypeEntity } from '../entities/contract-type.entity';
import { MasterDataNS } from '../modules/master-data/master-data';
import { default as ProjectRankEntity } from '../entities/project-rank.entity';
import { default as SettingOtherCostEntity } from '../entities/setting-other-cost.entity';
import { default as JobRankEntity } from '../entities/job-rank.entity';
import { default as DailyReportActivitiesEntity } from '../entities/daily-report-activities.entity';
import { MasterDataOptionDto } from '../modules/master-data/dtos/responses/master-data-option.dto';
import { default as PositionEntity } from '../entities/position.entity';
import { default as LineEntity } from '../entities/line.entity';
import { HandleMasterDataDto } from '../modules/master-data/dtos/requests/handle-master-data.dto';
import { UpdateMasterDataDto } from '../modules/master-data/dtos/requests/update-master-data.dto';
import { CreateMasterDataDto } from '../modules/master-data/dtos/requests/create-master-data.dto';
import { DeleteMasterDataDto } from '../modules/master-data/dtos/requests/delete-master-data.dto';
import { PageDto } from '../common/dto/page.dto';
import { MasterDataDto, SettingOtherCostDto } from '../modules/master-data/dtos/master-data.dto';
import { ListMasterDataDto } from '../modules/master-data/dtos/requests/list-master-data.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { isNil } from 'lodash';
import { default as DepartmentEntity } from '../entities/department.entity';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { UpdateDepartmentDto } from '../modules/master-data/dtos/requests/update-department.dto';
import { Op } from 'sequelize';
import { FLAG_PROTECTED } from './../common/constants/unit';
import ResourceEntity from '../entities/resource.entity';
import UserEntity from '../entities/users.entity';
import OtherCostEntity from '../entities/other-cost.entity';
import sequelize from 'sequelize';
import { count } from 'console';
import { CreateSettingOtherCostDto } from '../modules/master-data/dtos/requests/create-setting-other-cost.dto';
import { FilterDepartmentDto } from '../modules/master-data/dtos/requests/filter-department.dto';
import { default as ProjectStatusBiddingEntity } from '../entities/project-status-bidding.entity';
import { default as ProjectStatusDevelopmentEntity } from '../entities/project-status-development.entity';

export class MasterDataRepository implements MasterDataNS.IMasterDataRepository {
  constructor(
    @Inject(ContractTypeEntity.name) private readonly contractTypeEntity: typeof ContractTypeEntity,
    @Inject(ProjectRankEntity.name) private readonly projectRankEntity: typeof ProjectRankEntity,
    @Inject(ProjectStatusBiddingEntity.name) private readonly projectStatusBiddingEntity: typeof ProjectStatusBiddingEntity,
    @Inject(ProjectStatusDevelopmentEntity.name) private readonly projectStatusDevelopmentEntity: typeof ProjectStatusDevelopmentEntity,
    @Inject(JobRankEntity.name) private readonly jobRankEntity: typeof JobRankEntity,
    @Inject(DailyReportActivitiesEntity.name)
    private readonly dailyReportActivitiesEntity: typeof DailyReportActivitiesEntity,
    @Inject(PositionEntity.name) private readonly positionEntity: typeof PositionEntity,
    @Inject(LineEntity.name) private readonly lineEntity: typeof LineEntity,
    @Inject(DepartmentEntity.name) private readonly departmentEntity: typeof DepartmentEntity,
    @Inject(SettingOtherCostEntity.name) private readonly settingOtherCostEntity: typeof SettingOtherCostEntity,
  ) { }

  async getMasterDataList(
    type: MasterDataNS.MasterDataCodeList,
    dto: ListMasterDataDto,
  ): Promise<PageDto<MasterDataDto>> {
    let rows: MasterDataDto[];
    let count: number;

    switch (type) {
      case MasterDataNS.MasterDataCodeList.contract_type:
        rows = (
          await this.contractTypeEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.contractTypeEntity.count();
        break;

      case MasterDataNS.MasterDataCodeList.daily_report_activities:
        rows = (
          await this.dailyReportActivitiesEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.dailyReportActivitiesEntity.count();
        break;

      case MasterDataNS.MasterDataCodeList.project_rank:
        rows = (
          await this.projectRankEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.projectRankEntity.count();
        break;

      case MasterDataNS.MasterDataCodeList.project_status_bidding:
        rows = (
          await this.projectStatusBiddingEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.projectStatusBiddingEntity.count();
        break;

      case MasterDataNS.MasterDataCodeList.project_status_development:
        rows = (
          await this.projectStatusDevelopmentEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.projectStatusDevelopmentEntity.count();
        break;

      case MasterDataNS.MasterDataCodeList.job_rank:
        rows = (
          await this.jobRankEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.jobRankEntity.count();
        break;

      case MasterDataNS.MasterDataCodeList.line:
        rows = (
          await this.lineEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.lineEntity.count();
        break;

      case MasterDataNS.MasterDataCodeList.project_role:
        rows = (
          await this.positionEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.positionEntity.count();
        break;

      case MasterDataNS.MasterDataCodeList.setting_other_cost:
        rows = (
          await this.settingOtherCostEntity.findAll({
            order: [['order', dto.order]],
            limit: dto.take,
            offset: dto.skip,
          })
        ).toDtos();
        count = await this.settingOtherCostEntity.count();
        break;
    }

    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto: dto });
    return new PageDto(rows, pageMetaDto);
  }

  handleCreatedMasterData(type: MasterDataNS.MasterDataCodeList, createdData: CreateMasterDataDto[]) {
    return createdData.map((data) => {
      switch (type) {
        case MasterDataNS.MasterDataCodeList.contract_type:
          return this.contractTypeEntity.create({ ...data });

        case MasterDataNS.MasterDataCodeList.daily_report_activities:
          return this.dailyReportActivitiesEntity.create({ ...data });

        case MasterDataNS.MasterDataCodeList.job_rank:
          return this.jobRankEntity.create({ ...data });

        case MasterDataNS.MasterDataCodeList.project_rank:
          return this.projectRankEntity.create({ ...data });

        case MasterDataNS.MasterDataCodeList.project_status_bidding:
          return this.projectStatusBiddingEntity.create({ ...data });

        case MasterDataNS.MasterDataCodeList.project_status_development:
          return this.projectStatusDevelopmentEntity.create({ ...data });

        case MasterDataNS.MasterDataCodeList.line:
          return this.lineEntity.create({ ...data, flag_protected: 0 });

        case MasterDataNS.MasterDataCodeList.project_role:
          return this.positionEntity.create({ ...data, flag_protected: 0 });

        case MasterDataNS.MasterDataCodeList.setting_other_cost:
          return this.settingOtherCostEntity.create({ ...data });
      }
    });
  }

  handleUpdateMasterData(type: MasterDataNS.MasterDataCodeList, updatedData: UpdateMasterDataDto[], dataDB: any) {
    return updatedData.map((data) => {
      switch (type) {
        case MasterDataNS.MasterDataCodeList.contract_type:
          return this.contractTypeEntity.update({ ...data }, { where: { id: data.id } });

        case MasterDataNS.MasterDataCodeList.daily_report_activities:
          return this.dailyReportActivitiesEntity.update({ ...data }, { where: { id: data.id } });

        case MasterDataNS.MasterDataCodeList.job_rank:
          return this.jobRankEntity.update({ ...data }, { where: { id: data.id } });

        case MasterDataNS.MasterDataCodeList.project_rank:
          return this.projectRankEntity.update({ ...data }, { where: { id: data.id } });

        case MasterDataNS.MasterDataCodeList.project_status_bidding:
          return this.projectStatusBiddingEntity.update({ ...data }, { where: { id: data.id } });

        case MasterDataNS.MasterDataCodeList.project_status_development:
          return this.projectStatusDevelopmentEntity.update({ ...data }, { where: { id: data.id } });

        case MasterDataNS.MasterDataCodeList.line:
          if (dataDB[data.id]?.flag_protected == FLAG_PROTECTED) {
            data.name = dataDB[data.id]?.name;
          }
          return this.lineEntity.update({ ...data }, { where: { id: data.id } });

        case MasterDataNS.MasterDataCodeList.project_role:
          if (dataDB[data.id]?.flag_protected == FLAG_PROTECTED) {
            delete data.code;
            data.name = dataDB[data.id]?.name;
          }
          return this.positionEntity.update({ ...data }, { where: { id: data.id } });

        case MasterDataNS.MasterDataCodeList.setting_other_cost:
          if (!isNil(dataDB[data.id])) {
            return this.settingOtherCostEntity.update({ ...data }, { where: { id: data.id } });
          }
          return false;
      }
    });
  }

  handleDeletedMasterData(type: MasterDataNS.MasterDataCodeList, deletedData: DeleteMasterDataDto[], dataDB: any) {
    return deletedData.map((data) => {
      switch (type) {
        case MasterDataNS.MasterDataCodeList.contract_type:
          return this.contractTypeEntity.update({ deletedAt: new Date() }, { where: { id: data.id }, returning: true });

        case MasterDataNS.MasterDataCodeList.daily_report_activities:
          return this.dailyReportActivitiesEntity.update(
            { deletedAt: new Date() },
            { where: { id: data.id }, returning: true },
          );

        case MasterDataNS.MasterDataCodeList.job_rank:
          return this.jobRankEntity.update({ deletedAt: new Date() }, { where: { id: data.id }, returning: true });

        case MasterDataNS.MasterDataCodeList.project_rank:
          return this.projectRankEntity.update({ deletedAt: new Date() }, { where: { id: data.id }, returning: true });

        case MasterDataNS.MasterDataCodeList.project_status_bidding:
          return this.projectStatusBiddingEntity.update({ deletedAt: new Date() }, { where: { id: data.id }, returning: true });

        case MasterDataNS.MasterDataCodeList.project_status_development:
          return this.projectStatusDevelopmentEntity.update({ deletedAt: new Date() }, { where: { id: data.id }, returning: true });

        case MasterDataNS.MasterDataCodeList.line:
          if (dataDB[data.id]?.users == 0) {
            return this.lineEntity.update({ deletedAt: new Date() }, {
              where: {
                [Op.and]: {
                  id: data.id,
                  flag_protected: { [Op.ne]: FLAG_PROTECTED },
                },
              }, returning: true
            });
          }
          break;

        case MasterDataNS.MasterDataCodeList.project_role:
          if (dataDB[data.id]?.resources == 0) {
            return this.positionEntity.update({ deletedAt: new Date() }, {
              where: {
                [Op.and]: {
                  id: data.id,
                  flag_protected: { [Op.ne]: FLAG_PROTECTED },
                },
              }
              , returning: true
            });
          }
          break;

        case MasterDataNS.MasterDataCodeList.setting_other_cost:
          if (!isNil(dataDB[data.id])) {
            return this.settingOtherCostEntity.update({ deletedAt: new Date() }, { where: { id: data.id }, returning: true });
          }
          return false;
      }
    });
  }

  async handleMasterData(dto: HandleMasterDataDto): Promise<boolean> {
    let dataDB: any = {};

    switch (dto.type) {
      case MasterDataNS.MasterDataCodeList.line:
        const lines = await this.lineEntity.findAll({
          attributes: ['id', 'name', 'flag_protected'],
          where: {
            'deletedAt': null
          },
          include: [
            {
              model: UserEntity,
              attributes: ['id'],
              where: {
                'deletedAt': null
              },
              required: false,
            },
          ],
        });
        lines.forEach((item, index) => {
          dataDB[item.id] = {
            id: item.id,
            name: item.name,
            flag_protected: item.flag_protected,
            users: item.users.length,
          };
        })
        break;

      case MasterDataNS.MasterDataCodeList.project_role:
        const positions = await this.positionEntity.findAll({
          attributes: ['id', 'name', 'code', 'flag_protected'],
          where: {
            'deletedAt': null
          },
          include: [
            {
              model: ResourceEntity,
              attributes: ['id'],
              where: {
                'deletedAt': null
              },
              required: false,
            },
          ],
        });

        positions.forEach((item, index) => {
          dataDB[item.id] = {
            id: item.id,
            name: item.name,
            code: item.code,
            flag_protected: item.flag_protected,
            resources: item.resources.length,
          };
        })
        break;

      case MasterDataNS.MasterDataCodeList.setting_other_cost:
        const listOtherCost = await this.settingOtherCostEntity.findAll({
          attributes: ['id', 'name'],
          include: [
            {
              model: OtherCostEntity,
              attributes: ['id'],
              required: false,
            },
          ]
        });
        listOtherCost.forEach((item, index) => {
          if (item.other_cost.length === 0) {
            dataDB[item.id] = {
              id: item.id,
              order: item.order
            };
          } else {
            dataDB[item.id] = {
              id: item.id,
              name: item.name,
              order: item.order
            };
            if (dto.deletedData) {
              dto.deletedData.forEach((itemD, index) => {
                if (itemD.id === item.id) {
                  delete dto.deletedData[index];
                }
              });
            }
          }
        });
        break;
    }
    const isCreated = this.handleCreatedMasterData(dto.type, dto.createdData);
    const isUpdated = this.handleUpdateMasterData(dto.type, dto.updatedData, dataDB);
    const isDelteted = this.handleDeletedMasterData(dto.type, dto.deletedData, dataDB);
    try {
      await Promise.all([...isCreated, ...isUpdated, ...isDelteted]);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getMasterDataSummary(): Promise<MasterDataOptionDto[]> {
    const [
      countProjectRoleOp,
      countLineOp,
      countContractTypeOp,
      countDailyReportActivitiesOp,
      countJobRankOp,
      countProjectRankOp,
      countProjectStatusBiddingOp,
      countProjectStatusDevelopmentOp,
      countsettingOtherCostOp,
    ] = await Promise.all([
      this.positionEntity.count(),
      this.lineEntity.count(),
      this.contractTypeEntity.count(),
      this.dailyReportActivitiesEntity.count(),
      this.jobRankEntity.count(),
      this.projectRankEntity.count(),
      this.projectStatusBiddingEntity.count(),
      this.projectStatusDevelopmentEntity.count(),
      this.settingOtherCostEntity.count(),
    ]);
    const projectRoleOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.project_role,
      countOptions: countProjectRoleOp,
      code: MasterDataNS.MasterDataCodeList.project_role,
    };
    const lineOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.line,
      countOptions: countLineOp,
      code: MasterDataNS.MasterDataCodeList.line,
    };
    const contractTypeOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.contract_type,
      countOptions: countContractTypeOp,
      code: MasterDataNS.MasterDataCodeList.contract_type,
    };
    const dailyReportActivitiesOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.daily_report_activities,
      countOptions: countDailyReportActivitiesOp,
      code: MasterDataNS.MasterDataCodeList.daily_report_activities,
    };
    const jobRankOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.job_rank,
      countOptions: countJobRankOp,
      code: MasterDataNS.MasterDataCodeList.job_rank,
    };
    const projectRankOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.project_rank,
      countOptions: countProjectRankOp,
      code: MasterDataNS.MasterDataCodeList.project_rank,
    };
    const projectStatusBiddingOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.project_status_bidding,
      countOptions: countProjectStatusBiddingOp,
      code: MasterDataNS.MasterDataCodeList.project_status_bidding,
    };
    const projectStatusDevelopmentOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.project_status_development,
      countOptions: countProjectStatusDevelopmentOp,
      code: MasterDataNS.MasterDataCodeList.project_status_development,
    };
    const settingOtherCostOp: MasterDataOptionDto = {
      dataType: MasterDataNS.MasterDataList.setting_other_cost,
      countOptions: countsettingOtherCostOp,
      code: MasterDataNS.MasterDataCodeList.setting_other_cost,
    };
    return [projectRoleOp, lineOp, contractTypeOp, dailyReportActivitiesOp, jobRankOp, projectRankOp, projectStatusBiddingOp, projectStatusDevelopmentOp, settingOtherCostOp];
  }

  async getMasterDateContractType(id: number): Promise<ContractTypeEntity> {
    const contractType = await this.contractTypeEntity.findByPk(id);
    if (isNil(contractType)) {
      throw MasterDataNS.ERRORS.MasterNotFound;
    }
    return contractType;
  }

  async getMasterDataJobRank(id: number): Promise<JobRankEntity> {
    const jobRank = await this.jobRankEntity.findByPk(id);
    if (isNil(jobRank)) {
      throw MasterDataNS.ERRORS.MasterNotFound;
    }
    return jobRank;
  }

  async getMasterDataDepartment(id: number): Promise<DepartmentEntity> {
    const department = await this.departmentEntity.findByPk(id);
    if (isNil(department)) {
      throw MasterDataNS.ERRORS.MasterNotFound;
    }
    return department;
  }

  async getMasterDataLine(id: number): Promise<LineEntity> {
    const line = await this.lineEntity.findByPk(id);
    if (isNil(line)) {
      throw MasterDataNS.ERRORS.MasterNotFound;
    }
    return line;
  }

  async getDepartment(params: FilterDepartmentDto): Promise<DepartmentEntity[]> {
    const department = await this.departmentEntity.findAll({ order: [[params.orderField ?? 'createdAt', params.orderType ?? 'DESC']] });
    return department;
  }

  async createtDepartment(param: CreateMasterDataDto): Promise<DepartmentEntity> {
    const departments = await this.getDepartment({});
    departments.map((d) => {
      if (d.name === param.name && isNil(d.deletedAt)) {
        throw MasterDataNS.ERRORS.DepartmentExisted;
      }
    });
    const department = await this.departmentEntity.create({ ...param, flag_protected: 0 });
    return department;
  }

  async updateDepartment(id: number, param: UpdateDepartmentDto): Promise<DepartmentEntity> {
    const department = await this.departmentEntity.findByPk(id);
    if (isNil(department)) {
      throw MasterDataNS.ERRORS.MasterNotFound;
    }

    await department.update({ ...param });

    return department;
  }

  async deleteDepartment(id: number): Promise<SuccessResponseDto> {
    const department = await this.departmentEntity.findAll({
      attributes: ['id', 'flag_protected'],
      where: {
        'id': id,
        'deletedAt': null
      },
      include: [
        {
          model: UserEntity,
          attributes: ['id'],
          where: {
            'deletedAt': null
          },
          required: false,
        },
      ],
    });

    let dataDB: any = [];
    department.forEach((item, index) => {
      dataDB[item.id] = {
        id: item.id,
        flag_protected: item.flag_protected,
        users: item.users.length,
      };
    })

    if (dataDB[id].flag_protected !== FLAG_PROTECTED && dataDB[id].users == 0) {
      await this.departmentEntity.destroy({
        where: { id },
      });
    }

    return new SuccessResponseDto(true);
  }

  async checkProjectRank(id: number): Promise<ProjectRankEntity | null> {
    return await this.projectRankEntity.findByPk(id);
  }

  async checkSettingOtherCose(id: number): Promise<SettingOtherCostEntity | null> {
    return await this.settingOtherCostEntity.findByPk(id);
  }

  async getSettingOtherCost(): Promise<SettingOtherCostDto[]> {
    const settingOtherCost = await this.settingOtherCostEntity.findAll({ order: [['order', 'ASC']] });
    return settingOtherCost;
  }

  async createSettingOtherCost(params: CreateSettingOtherCostDto): Promise<SuccessResponseDto> {
    const settingOtherCost = await this.getSettingOtherCost();
    const maxOrder: number = settingOtherCost.length + 1;
    settingOtherCost.map((d) => {
      if (d.name === params.name) {
        throw MasterDataNS.ERRORS.DepartmentExisted;
      }
    });
    await this.settingOtherCostEntity.create({ ...params, flag_protected: 0, order: maxOrder });
    return new SuccessResponseDto(true);
  }

  // Thêm 2 methods bị thiếu để implement interface
  async checkProjectStatusBidding(id: number): Promise<ProjectStatusBiddingEntity | null> {
    return await this.projectStatusBiddingEntity.findByPk(id);
  }

  async checkProjectStatusDevelopment(id: number): Promise<ProjectStatusDevelopmentEntity | null> {
    return await this.projectStatusDevelopmentEntity.findByPk(id);
  }
}