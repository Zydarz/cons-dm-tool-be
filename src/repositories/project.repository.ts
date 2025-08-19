import { Inject } from '@nestjs/common';
import { ProjectNS } from '../modules/projects/interfaces/project';
import { default as ProjectEntity } from '../entities/project.entity';
import { PageDto } from '../common/dto/page.dto';
import { ProjectDto } from '../modules/projects/dto/responses/project-dto';
import { ProjectFilterOptionsDto } from '../modules/projects/dto/requests/project-filter-options.dto';
import { isNil, isEmpty } from 'lodash';
import { Op, Transaction, WhereOptions } from 'sequelize';
import moment from 'moment';
import { default as UserProjectEntity } from '../entities/user_project.entity';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { ResourceProjectFilterDto } from '../modules/resources/dto/requests/resource-project-filter.dto';
import { ProjectResourceAllocateDto } from '../modules/resources/dto/responses/project-resource-allocate-dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { CreateProjectDto } from '../modules/projects/dto/requests/create-project.dto';
import { UpdateProjectDto } from '../modules/projects/dto/requests/update-project.dto';
import { SequelizeCodeErrs } from '../common/constants/sequelize-error';
import { default as BotSettingEntity } from '../entities/bot-setting.entity';
import { FilterProjectDto } from '../modules/projects/dto/requests/filter-project.dto';
import { default as ContractTypeEntity } from '../entities/contract-type.entity';
import { default as CustomerEntity } from '../entities/customer.entity';
import { default as DepartmentEntity } from '../entities/department.entity';
import { TimeSheetProjectDto } from 'modules/projects/dto/responses/timesheet-project-dto';
// ✅ Đúng - sử dụng đường dẫn tương đối
import { TimeSheetProjectOfMemberDto } from '../modules/projects/dto/responses/timesheet-project-member-dto';
export class ProjectRepository implements ProjectNS.IProjectRepository {
  constructor(@Inject(ProjectEntity.name) private readonly projectEntity: typeof ProjectEntity) { }

  async getAll(projectFilterOptionsDto: ProjectFilterOptionsDto): Promise<PageDto<ProjectDto>> {
    const condition = {};
    const userProjectRelation = {
      model: UserProjectEntity,
      as: 'userProjects',
    };
    if (!isNil(projectFilterOptionsDto)) {
      let startDate: string | undefined;
      let endDate: string | undefined;
      if (!isNil(projectFilterOptionsDto.startDate) && !isNil(projectFilterOptionsDto.endDate)) {
        startDate = moment(projectFilterOptionsDto.startDate).startOf('day').toISOString();
        endDate = moment(projectFilterOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          [Op.or]: [
            {
              [Op.and]: {
                startDate: { [Op.lte]: startDate },
                endDate: { [Op.between]: [startDate, endDate] },
              },
            },
            {
              [Op.and]: {
                startDate: { [Op.lte]: startDate },
                endDate: { [Op.gte]: endDate },
              },
            },
            {
              [Op.and]: {
                startDate: { [Op.gte]: startDate },
                endDate: { [Op.lte]: endDate },
              },
            },
            {
              [Op.and]: {
                startDate: { [Op.between]: [startDate, endDate] },
                endDate: { [Op.gte]: endDate },
              },
            },
          ],
        });
      } else if (!isNil(projectFilterOptionsDto.startDate)) {
        startDate = moment(projectFilterOptionsDto.startDate).startOf('day').toISOString();
        Object.assign(condition, {
          endDate: { [Op.gte]: startDate },
        });
      } else if (!isNil(projectFilterOptionsDto.endDate)) {
        endDate = moment(projectFilterOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          startDate: { [Op.lte]: endDate },
        });
      }

      if (!isNil(projectFilterOptionsDto.projectId)) {
        const projectId = projectFilterOptionsDto.projectId.split(',');
        Object.assign(condition, {
          id: { [Op.in]: projectId },
        });
      }
      if (!isEmpty(projectFilterOptionsDto.customerId) && !isNil(projectFilterOptionsDto.customerId)) {
        const customerId = projectFilterOptionsDto.customerId.split(',');
        Object.assign(condition, {
          customerId: { [Op.in]: customerId },
        });
      }

      if (!isNil(projectFilterOptionsDto.userId)) {
        Object.assign(userProjectRelation, {
          where: {
            userId: { [Op.like]: projectFilterOptionsDto.userId },
          },
        });
      }

      if (!isNil(projectFilterOptionsDto.status)) {
        const array = projectFilterOptionsDto.status.split(',');
        Object.assign(condition, {
          status: { [Op.in]: array },
        });
      }
    }

    const results = await this.projectEntity.findAndCountAll({
      where: condition,
      include: [
        userProjectRelation,
        {
          model: ContractTypeEntity,
          as: 'contractType',
          paranoid: false,
          attributes: ['id', 'name', 'deletedAt'],
        },
        {
          model: CustomerEntity,
          as: 'customer',
          paranoid: false,
          attributes: ['id', 'name', 'deletedAt'],
        },
      ],
      limit: projectFilterOptionsDto.take,
      offset: projectFilterOptionsDto.skip,
      distinct: true,
      order: [['startDate', 'DESC']],
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto: projectFilterOptionsDto, itemCount: results.count });
    const items = results.rows;
    return items.toPageDto(pageMetaDto);
  }

  async findById(id: number): Promise<ProjectEntity | null> {
    return await this.projectEntity.findByPk(id);
  }

  async getProject(filter: FilterProjectDto): Promise<ProjectDto | null> {
    const condition: WhereOptions = {};
    const { projectId, email } = filter;
    if (projectId) {
      condition.id = projectId;
    }
    if (email) {
      condition.email = email;
    }
    const project = await this.projectEntity.findOne({
      where: condition,
      include: [
        {
          model: BotSettingEntity,
          as: 'botSetting',
        },
        {
          model: ContractTypeEntity,
          as: 'contractType',
          paranoid: false,
          attributes: ['id', 'name', 'deletedAt'],
        },
        {
          model: DepartmentEntity,
          as: 'department',
          paranoid: false,
          attributes: ['id', 'name', 'deletedAt'],
        },
        {
          model: CustomerEntity,
          as: 'customer',
          paranoid: false,
          attributes: ['id', 'name', 'deletedAt'],
        },
      ],
    });
    return project?.toDto() ?? null;
  }

  async getAllProjectOfUser(id?: string): Promise<ProjectEntity[]> {
    let filter = {};
    if (id) {
      filter = {
        include: [
          {
            model: UserProjectEntity,
            as: 'userProjects',
            where: {
              userId: id,
            },
          },
        ],
      };
    }
    const projects = await ProjectEntity.findAll(filter);
    return projects;
  }

  async getProjectResource(
    resourceProjectFilterDto: ResourceProjectFilterDto,
  ): Promise<PageDto<ProjectResourceAllocateDto>> {
    const condition = {};
    if (!isNil(resourceProjectFilterDto)) {
      let startDate: string | undefined;
      let endDate: string | undefined;
      if (!isNil(resourceProjectFilterDto.startDate) && !isNil(resourceProjectFilterDto.endDate)) {
        startDate = moment(resourceProjectFilterDto.startDate).startOf('day').toISOString();
        endDate = moment(resourceProjectFilterDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          [Op.or]: [
            {
              [Op.and]: {
                startDate: { [Op.lte]: startDate },
                endDate: { [Op.between]: [startDate, endDate] },
              },
            },
            {
              [Op.and]: {
                startDate: { [Op.lte]: startDate },
                endDate: { [Op.gte]: endDate },
              },
            },
            {
              [Op.and]: {
                startDate: { [Op.gte]: startDate },
                endDate: { [Op.lte]: endDate },
              },
            },
            {
              [Op.and]: {
                startDate: { [Op.between]: [startDate, endDate] },
                endDate: { [Op.gte]: endDate },
              },
            },
          ],
        });
      } else if (!isNil(resourceProjectFilterDto.startDate)) {
        startDate = moment(resourceProjectFilterDto.startDate).startOf('day').toISOString();
        Object.assign(condition, {
          endDate: { [Op.gte]: startDate },
        });
      } else if (!isNil(resourceProjectFilterDto.endDate)) {
        endDate = moment(resourceProjectFilterDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          startDate: { [Op.lte]: endDate },
        });
      }
      if (!isNil(resourceProjectFilterDto.projectIds)) {
        const resourceProjectFilter = resourceProjectFilterDto.projectIds.split(',').map(Number);
        Object.assign(condition, {
          id: { [Op.in]: resourceProjectFilter },
        });
      }
      if (!isNil(resourceProjectFilterDto.divisionIds)) {
        Object.assign(condition, {
          departmentId: { [Op.in]: resourceProjectFilterDto.divisionIds },
        });
      }
      if (!isNil(resourceProjectFilterDto.status)) {
        Object.assign(condition, {
          status: { [Op.like]: resourceProjectFilterDto.status },
        });
      }
    }
    const orderBy = ['startDate'];
    const attributes = ['id', 'name', 'code', 'type', 'status', 'startDate', 'endDate', 'pm', 'am'];
    const [items, pageMetaDto] = await this.projectEntity.paginate(
      resourceProjectFilterDto,
      condition,
      undefined,
      orderBy,
      attributes,
    );
    return items.toPageDto(pageMetaDto);
  }

  async createProject(createProjectDto: CreateProjectDto, type: string, name?: string): Promise<ProjectDto> {
    let project: ProjectEntity;
    let code: string;
    if (!name) {
      code = `${type} - ${createProjectDto.name} - ${createProjectDto.am}`;
    } else {
      code = `${type} - ${name} - ${createProjectDto.name} - ${createProjectDto.am}`;
    }
    try {
      project = await this.projectEntity.create({
        ...createProjectDto,
        code,
      });
    } catch (e) {
      if (e.name === SequelizeCodeErrs.DUPLICATE) {
        throw ProjectNS.errMsg.ProjectExisted;
      }
      throw e;
    }
    return project.toDto();
  }
  async updateProject(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
    name?: string,
    type?: string,
  ): Promise<ProjectDto> {
    const project = await this.findById(projectId);
    if (isNil(project)) {
      throw ProjectNS.errMsg.ProjectNotFound;
    }
    const code = project.code.split('-');
    if (name) {
      code[1] = ` ${name} `;
      code[2] = ` ${updateProjectDto.name} `;
      code[3] = ` ${updateProjectDto.am}`;
    } else {
      code[1] = ` ${updateProjectDto.name} `;
      code[2] = ` ${updateProjectDto.am}`;
      if (code[3]) {
        code.splice(3);
      }
    }
    if (type) {
      code[0] = `${type} `;
    }
    const generate = code.join('-');
    try {
      await project.update({
        ...updateProjectDto,
        code: generate,
      });
    } catch (e) {
      if (e.name === SequelizeCodeErrs.DUPLICATE) {
        throw ProjectNS.errMsg.ProjectExisted;
      }
      throw e;
    }
    return project.toDto();
  }
  async updateProjectPm(projectId: number, pm: string): Promise<void> {
    const project = await this.findById(projectId);
    if (isNil(project)) {
      throw ProjectNS.errMsg.ProjectNotFound;
    }
    await project.update({
      pm,
    });
  }
  async deleteProject(projectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    const project = await this.findById(projectId);
    if (isNil(project)) {
      return new SuccessResponseDto(false);
    }
    await project.destroy({ transaction: t });
    return new SuccessResponseDto(true);
  }

  async getProjectForPm(email: string): Promise<ProjectDto[]> {
    const [headMail] = email.split('@');
    const projects = await this.projectEntity.findAll({
      where: {
        pm: { [Op.like]: [`%${headMail}%`] },
      },
    });
    return projects.toDtos();
  }
  async getProjectOfUser(id: string): Promise<ProjectDto[]> {
    const projects = await this.projectEntity.findAll({
      include: [
        {
          model: UserProjectEntity,
          as: 'userProjects',
          where: {
            userId: id,
          },
        },
      ],
    });
    return projects.toDtos();
  }

  async getProjectByUserId(id: string): Promise<TimeSheetProjectOfMemberDto[]> {
    const projects = await this.projectEntity.findAll({
      include: [
        {
          model: UserProjectEntity,
          as: 'userProjects',
          where: {
            userId: id,
          },
        },
      ],
    });

    return projects.map(project => new TimeSheetProjectOfMemberDto(project));
  }

  async getAllProjectsForTimesheet(): Promise<TimeSheetProjectOfMemberDto[]> {
    const projects = await this.projectEntity.findAll();
    return projects.map(project => new TimeSheetProjectOfMemberDto(project));
  }


  async getInfoAllProject(projectFilterOptionsDto: ProjectFilterOptionsDto): Promise<ProjectDto[]> {
    const condition: WhereOptions = {};
    let isNest = false;
    if (projectFilterOptionsDto.userId) {
      condition.userId = projectFilterOptionsDto.userId;
      isNest = true;
    }
    const projects = await this.projectEntity.findAll({
      attributes: ['id', 'name', 'code', 'currency', 'status'],
      include: [
        {
          model: UserProjectEntity,
          as: 'userProjects',
          where: condition,
          required: isNest,
        },
      ],
    });
    return projects.toDtos();
  }

  async updateCustomerIdInProjectRecords(customerId: number, t?: Transaction): Promise<SuccessResponseDto> {
    await this.projectEntity.update(
      {
        customerId: null,
      },
      {
        where: {
          customerId,
        },
        transaction: t,
        paranoid: false,
      },
    );

    return new SuccessResponseDto(true);
  }

  async getProjectsOfCustomer(customerId: number): Promise<ProjectDto[]> {
    const projects = await this.projectEntity.findAll({
      where: {
        customerId,
      },
    });

    return projects.toDtos();
  }

  async getAllProjects(): Promise<ProjectDto[]> {
    const projects = await this.projectEntity.findAll();
    return projects.toDtos();
  }

  async deleteCustomer(id: number): Promise<SuccessResponseDto> {
    const project = await this.projectEntity.findOne({
      where: {
        customerId: id,
      },
    });
    if (!project) {
      throw ProjectNS.errMsg.ProjectNotFound;
    }
    const code = project.code.split('-');
    code.splice(1, 1);
    const newCode = code.join('-');
    await project.update({
      code: newCode,
    });
    return new SuccessResponseDto(true);
  }

  async getProjectByDepartment(id: number): Promise<ProjectDto[]> {
    const projects = await this.projectEntity.findAll({
      where: {
        departmentId: id,
      },
    });
    return projects;
  }
}
