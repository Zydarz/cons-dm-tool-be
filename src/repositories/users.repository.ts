import { Inject } from '@nestjs/common';
import { IUserSearch } from '../interfaces/IUserSearch';
import { isEmpty, isNil } from 'lodash';
import { default as UserEntity } from '../entities/users.entity';
import { UserNS } from '../modules/users/interface/users';
import { PageDto } from '../common/dto/page.dto';
import { Op, WhereOptions, Sequelize, col, fn } from 'sequelize';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { default as LineEntity } from '../entities/line.entity';
import { FilterUserSummaryDto } from '../modules/resources/dto/requests/filter-user-summary-dto';
import { FilterUserAllowcationDto } from '../modules/resources/dto/requests/filter-user-allocation-dto';
import { default as UserProjectEntity } from '../entities/user_project.entity';
import { default as ProjectEntity } from '../entities/project.entity';
import { default as ResourceEntity } from '../entities/resource.entity';
import { default as PositionEntity } from '../entities/position.entity';
import { CreateUserDto } from '../modules/users/dto/request/create-user-dto';
import { UpdateUserDto } from '../modules/users/dto/request/update-user-dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { AzureUserDto } from '../modules/users/dto/response/azure-user-dto';
import { default as JobRankEntity } from '../entities/job-rank.entity';
import { default as DepartmentEntity } from '../entities/department.entity';
import { UserDivition } from '../modules/users/dto/request/user-search-division.dto';
import { UserDto } from '../modules/users/dto/response/user-dto';
import { default as RoleEntity } from '../entities/role.entity';
import { RoleNS } from '../modules/roles/interfaces/role';
import { DeleteRoleDto } from '../modules/roles/dto/request/confirm-delete-role-dto';
import { GUser } from 'interfaces/IUserGoogle';
import { LineUsingDto } from 'modules/users/dto/response/line-using-dto';
import { RoleUsingDto } from 'modules/users/dto/response/role-using-dto';
import { DepartmentUsingDto } from 'modules/users/dto/response/department-using-dto';
import { FLAG_PROTECTED, STATUS_ACTIVE, STATUS_INACTIVE } from '../common/constants/unit';
import { default as UserSalariesEntity } from '../entities/user-salaries.entity';
import { GetSalaryDto } from '../modules/users/dto/request/get-salary-dto';
import { GetSalaryCostDto } from '../modules/users/dto/request/get-salary-cost-dto';
import { UserSalaryPaggingDto } from '../modules/user-salary/dto/responses/user-salary-paging.dto';
import { UserSalaryPaggingFilterDto } from '../modules/user-salary/dto/requests/user-salary-pagging-filter.dto';
import { UserPaggingDto } from '../modules/users/dto/response/user-pagging-dto';
import { SalaryDto } from '../modules/users/dto/response/salary-dto';
import { CheckExitsEmployeeDto } from '../modules/users/dto/request/check-exits-employe-dto';
import sequelize from 'sequelize';
import { TimeSheetMemberDto } from '../modules/users/dto/response/user-project-dto';
export class UsersRepository implements UserNS.IUserRepository {
  constructor(@Inject('UserEntity') private readonly userEntity: typeof UserEntity,
    @Inject('DepartmentEntity') private readonly departmentEntity: typeof DepartmentEntity,
    @Inject('ProjectEntity') private readonly projectEntity: typeof ProjectEntity,
    @Inject('UserSalariesEntity') private readonly userSalariesEntity: typeof UserSalariesEntity
  ) { }

  async getUserMasterData(id: string): Promise<UserEntity> {
    const doc = await this.userEntity.findOne({
      where: {
        [Op.or]: [{ id }, { idGoogle: id }]
      },
      include: [
        {
          model: LineEntity,
          as: 'line',
        },
      ],
    });
    if (isNil(doc)) {
      throw UserNS.ERRORS.UserNotFound;
    }
    return doc;
  }

  async listUserMasterData(search: IUserSearch): Promise<UserEntity[]> {
    const { displayName, mail, username, lineId, status, startDate, endDate, jobRankId, departmentId } = search;
    const condition: WhereOptions = {};
    if (displayName) {
      condition.displayName = { [Op.substring]: displayName };
    }
    if (mail) {
      condition.mail = { [Op.substring]: mail };
    }
    if (username) {
      condition.username = { [Op.substring]: username };
    }
    if (lineId) {
      condition.lineId = lineId;
    }
    if (jobRankId) {
      condition.jobRankId = jobRankId;
    }
    if (departmentId) {
      condition.departmentId = departmentId;
    }
    if (status) {
      condition.status = { [Op.in]: status.split(',') };
    }
    if (startDate && endDate) {
      const userActive = await this.userEntity.findAll({
        where: {
          ...condition,
          status: UserNS.Status.ACTIVE,
        },
        raw: true,
      });
      const userInActive = await this.userEntity.findAll({
        where: {
          ...condition,
          status: { [Op.not]: [UserNS.Status.ACTIVE] },
        },
        include: [
          {
            model: LineEntity,
            as: 'line',
            paranoid: false,
            attributes: ['id', 'name', 'deletedAt'],
          },
          {
            model: JobRankEntity,
            as: 'jobRank',
            paranoid: false,
            attributes: ['id', 'name', 'order', 'deletedAt'],
          },
          {
            model: DepartmentEntity,
            as: 'department',
            paranoid: false,
            attributes: ['id', 'name', 'deletedAt'],
          },
          {
            model: UserProjectEntity,
            as: 'userProjects',
            required: true,
            include: [
              {
                model: ResourceEntity,
                as: 'resources',
                required: true,
                where: {
                  date: { [Op.between]: [startDate, `${endDate} 23:59:59`] },
                },
              },
            ],
          },
        ],
        nest: true,
        ...(true && { distinct: true }) as any, // 👈 ép kiểu để tránh lỗi TS
      });


      return userActive.concat(userInActive);
    } else {
      return await this.userEntity.findAll({
        where: {
          ...condition,
        },
        include: [
          {
            model: LineEntity,
            as: 'line',
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
            model: JobRankEntity,
            as: 'jobRank',
            paranoid: false,
            attributes: ['id', 'name', 'order', 'deletedAt'],
          },
        ],
      });
    }
  }

  async getPaginationUsers(search: UserDivition, role: RoleEntity, user: UserEntity): Promise<PageDto<UserDto>> {
    const { displayName, mail, username, lineId, status, jobRankId, departmentId, systemRoleId, startDate, endDate, nameSearch } = search;
    const condition: WhereOptions = { 'deletedAt': null };
    const conditionSalary: WhereOptions = {};

    if (startDate && endDate) {
      conditionSalary.date = { [Op.between]: [startDate, `${endDate} 23:59:59`] };
    }

    if (displayName) {
      condition.displayName = { [Op.substring]: displayName };
    }
    if (mail) {
      condition.mail = { [Op.substring]: mail };
    }
    if (username) {
      condition.username = { [Op.substring]: username };
    }
    if (nameSearch) {
      Object.assign(condition, {
        [Op.or]: {
          username: { [Op.substring]: nameSearch },
          surName: { [Op.substring]: nameSearch },
        },
      });
    }
    if (lineId) {
      condition.lineId = lineId;
    }
    if (jobRankId) {
      condition.jobRankId = jobRankId;
    }
    if (systemRoleId) {
      condition.roleId = systemRoleId;
    }
    if (role?.allDivision === RoleNS.SCOPE.ALL && departmentId) {
      condition.departmentId = departmentId;
    } else if (role?.allDivision === RoleNS.SCOPE.DIVISION) {
      condition.departmentId = user.departmentId;
    }
    if (status) {
      condition.status = { [Op.in]: status.split(',') };
    }
    const offset = search.page ? search.take * (search.page - 1) : 0;
    const count = await this.userEntity.count({
      where: condition,
    });

    const group = await this.userEntity.findAll({
      where: {
        deletedAt: null,
      },
      attributes: [
        'departmentId',
        [Sequelize.fn('COUNT', Sequelize.col('users.id')), 'userCount'],
      ],
      group: ['users.departmentId', 'department.id', 'department.name'],
      include: [
        {
          model: DepartmentEntity,
          as: 'department',
          attributes: ['id', 'name'],
          required: false,
          paranoid: false,
        },
      ],
      raw: false,
    });

    const detail = await Promise.all(
      group.map(async (g) => {
        const count = await this.userEntity.count({
          where: {
            ...condition,
            departmentId: g.departmentId,
          },
        });
        return {
          departmentId: g.departmentId,
          name: g.department?.name,
          count,
        };
      }),
    );
    const rows = await this.userEntity.findAll({
      where: condition,
      limit: search.take,
      offset,
      order: [
        ['displayName', 'ASC'],
        ['givenName', 'ASC'],
      ],
      include: [
        {
          model: LineEntity,
          as: 'line',
          paranoid: false,
          attributes: ['id', 'name', 'order', 'deletedAt'],
        },
        {
          model: DepartmentEntity,
          as: 'department',
          paranoid: false,
          attributes: ['id', 'name', 'deletedAt'],
        },
        {
          model: JobRankEntity,
          as: 'jobRank',
          paranoid: false,
          attributes: ['id', 'name', 'order', 'deletedAt'],
        },
        {
          model: UserSalariesEntity,
          paranoid: true,
          as: 'userSalaries',
          required: false,
          where: conditionSalary,
          on: {
            col1: sequelize.where(sequelize.col("users.id"), "=", sequelize.col("userSalaries.userId")),
            col2: sequelize.where(sequelize.col("users.departmentId"), "=", sequelize.col("userSalaries.departmentId"))
          },
        },
      ],
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto: search }, undefined, detail);
    return new PageDto(UserNS.dtos.toUserDtos(rows), pageMetaDto);
  }

  async getUserByID(id: string): Promise<UserEntity | null> {
    return await this.userEntity.findOne({
      where: { id },
      include: [
        {
          model: LineEntity,
          as: 'line',
        },
      ],
    });
  }

  async getUserByLineIds(id: string, options: FilterUserSummaryDto): Promise<UserEntity | null> {
    const userEntity = await this.userEntity.findOne({
      where: { id },
      include: [
        {
          model: LineEntity,
          as: 'line',
        },
      ],
    });
    return userEntity;
  }
  async getUserAll(fields: Array<string>, filterOptions: FilterUserSummaryDto): Promise<UserEntity[]> {
    let filter = {};
    const condition: WhereOptions = {};
    // condition.status = UserNS.Status.ACTIVE;
    let lineIds: string[] = [];
    if (filterOptions.lineId) {
      lineIds = filterOptions.lineId.split(',');
      condition.lineId = { [Op.in]: lineIds };
    }
    if (filterOptions.status && [STATUS_ACTIVE, STATUS_INACTIVE].includes(filterOptions.status)) {
      condition.status = filterOptions.status;
    } else {
      condition.status = { [Op.in]: [STATUS_ACTIVE, STATUS_INACTIVE] };
    }

    if (!isNil(filterOptions.divisionIds) && filterOptions.divisionIds.length > 0) {
      Object.assign(condition, {
        departmentId: { [Op.in]: filterOptions.divisionIds },
      });
    }

    if (!isNil(filterOptions.memberIds) && filterOptions.memberIds.length > 0) {
      Object.assign(condition, {
        id: { [Op.in]: filterOptions.memberIds },
      });
    }

    if (!isEmpty(fields)) {
      filter = {
        attributes: fields,
        order: [['displayName', 'ASC']],
        where: condition,
      };
    }
    const users = await this.userEntity.findAll(filter);
    return users;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userEntity.findOne({
      where: {
        mail: email,
      },
      include: [
        {
          model: LineEntity,
          as: 'line',
        },
      ],
    });
    return user;
  }

  async getAllProjectOfUser(
    filterOptions: FilterUserAllowcationDto,
    options?: string,
    view?: string,
  ): Promise<UserEntity[]> {
    const { startDate, endDate, userIds, role, take, displayName, mail, lineIds, userId, projectIds } = filterOptions;
    let requiredUserProject = true;
    const userCondition: WhereOptions = {};
    const conditionUserProject: WhereOptions = {};
    if (userIds) {
      userCondition.id = { [Op.in]: userIds };
    }
    if ((role && role === UserNS.Roles.ADMIN) || role === UserNS.Roles.LOS) {
      requiredUserProject = false;
    }
    if (displayName) {
      userCondition.displayName = { [Op.substring]: displayName };
    }
    if (mail) {
      userCondition.mail = { [Op.substring]: mail };
    }
    if (lineIds) {
      userCondition.lineId = lineIds;
    }
    if (userId) {
      userCondition.id = userId;
    }
    if (projectIds) {
      conditionUserProject.projectId = { [Op.in]: projectIds };
    }

    if (options) {
      return await this.userEntity.findAll({
        where: userCondition,
        include: [
          {
            model: LineEntity,
            as: 'line',
          },
        ],
        limit: take,
        offset: filterOptions.skip,
        nest: true,
        raw: true,
        order: [['username', 'ASC']],
      });
    }
    if (view) {
      return await this.userEntity.findAll({
        where: userCondition,
        include: [
          {
            model: UserProjectEntity,
            as: 'userProject',
            where: conditionUserProject,
            required: true,
            include: [
              {
                model: ProjectEntity,
                as: 'projects',
              },
              {
                model: ResourceEntity,
                as: 'resource',
                where: {
                  date: { [Op.between]: [new Date(startDate), new Date(endDate)] },
                },
                include: [
                  {
                    model: PositionEntity,
                    as: 'position',
                  },
                ],
                required: false,
              },
            ],
          },
          {
            model: LineEntity,
            as: 'line',
          },
        ],
        limit: take,
        offset: filterOptions.skip,
        nest: true,
        raw: true,
        order: [['username', 'ASC']],
      });
    }
    return await this.userEntity.findAll({
      where: userCondition,
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: conditionUserProject,
          required: requiredUserProject,
          include: [
            {
              model: ProjectEntity,
              as: 'projects',
            },
            {
              model: ResourceEntity,
              as: 'resource',
              where: {
                date: { [Op.between]: [new Date(startDate), new Date(endDate)] },
              },
              include: [
                {
                  model: PositionEntity,
                  as: 'position',
                },
              ],
              required: false,
            },
          ],
        },
        {
          model: LineEntity,
          as: 'line',
        },
      ],
      limit: take,
      offset: filterOptions.skip,
      nest: true,
      raw: true,
      order: [['username', 'ASC']],
    });
  }

  async getMemberByProjectId(ids: number[]): Promise<TimeSheetMemberDto[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const projects = await this.userEntity.findAll({
      include: [
        {
          model: UserProjectEntity,
          as: 'userProjects',
          where: {
            projectId: {
              [Op.in]: ids,
            },
          },
        },
      ],
    });

    return projects.map(project => new TimeSheetMemberDto(project));
  }

  async getAllMembersForTimesheet(): Promise<TimeSheetMemberDto[]> {
    const users = await this.userEntity.findAll();
    return users.map(user => new TimeSheetMemberDto(user));
  }



  async countUser(role: UserNS.Roles, dto: FilterUserAllowcationDto): Promise<number> {
    const { userIds, userId, projectIds } = dto;
    let userProjectRequired = false;
    const where: WhereOptions = {};
    const conditionUserProject: WhereOptions = {};
    if (role !== UserNS.Roles.ADMIN) {
      userProjectRequired = true;
      if (projectIds) {
        conditionUserProject.projectId = { [Op.in]: projectIds };
      }
      if (userIds) {
        where.id = { [Op.in]: userIds };
      }
      if (userId) {
        where.id = userId;
      }
    }

    const user = await this.userEntity.findAll({
      where,
      include: {
        model: UserProjectEntity,
        where: conditionUserProject,
        as: 'userProject',
        required: userProjectRequired,
      },
    });
    return user.length;
  }
  async createUser(param: CreateUserDto): Promise<UserEntity> {
    try {
      const dataInsert = {
        id: param.id,
        employeeId: param.employeeId,
        lineId: param.lineId,
        jobRankId: param.jobRankId,
        departmentId: param.departmentId,
        mail: param.mail,
        displayName: param.displayName,
        givenName: param.givenName,
        surName: param.surName,
        role: param.role,
        roleId: UserNS.RoleID.MEMBER,
        status: param.status,
        type: param.type,
        flagOnsite: param.flagOnsite,
        note: param.note,
        username: param.mail.split('@')[0],
        dependent: param.dependent,
        bankId: param.bankId,
        bankName: param.bankName,
        bankAccountHolder: param.bankAccountHolder,
        salaryDefault: 0
      };

      if (param.role) {
        switch (param.role) {
          case 'los':
            dataInsert.roleId = UserNS.RoleID.LOS;
            break;
          case 'admin':
            dataInsert.roleId = UserNS.RoleID.ADMIN;
            break;
          case 'member':
            dataInsert.roleId = UserNS.RoleID.MEMBER;
            break;
          default:
            break;
        }
      }

      const users = await this.userEntity.create(dataInsert);
      return users;
    } catch (e) {

      console.log('err', e);

      throw UserNS.ERRORS.UserExisted;
    }
  }

  async updateUser(id: string, param: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userEntity.findByPk(id);
    if (isNil(user)) {
      throw UserNS.ERRORS.UserNotFound;
    }
    try {
      if (param.role) {
        switch (param.role) {
          case 'los':
            param.roleId = UserNS.RoleID.LOS;
            break;
          case 'admin':
            param.roleId = UserNS.RoleID.ADMIN;
            break;
          case 'member':
            param.roleId = UserNS.RoleID.MEMBER;
            break;
          default:
            break;
        }
      }
      if (!isNil(param.salaries)) {
        const dataCheckExisted = await this.userSalariesEntity.findAll({
          where: {
            'userId': id,
            'departmentId': user.departmentId,
          }
        });
        let dataUpdateSalaries: any = [];
        let dataCreateSalaries: any = [];
        param.salaries.forEach(async (itemCreate, index) => {
          let continueItem = 1;
          if (!isNil(dataCheckExisted)) {
            dataCheckExisted.forEach((item: any) => {
              if (item.year == itemCreate.year && item.month == itemCreate.month) {
                let itemUpdate = {
                  userId: id,
                  bankId: itemCreate.bankId,
                  bankName: itemCreate.bankName,
                  dependent: itemCreate.dependent,
                  paymentType: itemCreate.paymentType,
                  salary: itemCreate.salary,
                  socialInsuranceSalary: itemCreate.socialInsuranceSalary,
                  type: itemCreate.type,
                  departmentId: user.departmentId,
                  status: itemCreate.status,
                  month: itemCreate.month,
                  year: itemCreate.year,
                };
                dataUpdateSalaries.push(itemUpdate);
                continueItem = 0;
              }
            });
          }
          if (continueItem === 1) {
            dataCreateSalaries[index] = {};
            dataCreateSalaries[index].userId = id;
            dataCreateSalaries[index].salary = itemCreate.salary;
            dataCreateSalaries[index].socialInsuranceSalary = itemCreate.socialInsuranceSalary;
            dataCreateSalaries[index].departmentId = user.departmentId;
            dataCreateSalaries[index].dependent = itemCreate.dependent;
            dataCreateSalaries[index].bankId = itemCreate.bankId;
            dataCreateSalaries[index].bankName = itemCreate.bankName;
            dataCreateSalaries[index].year = itemCreate.year;
            dataCreateSalaries[index].month = itemCreate.month;
            dataCreateSalaries[index].date = `${itemCreate.year}-${itemCreate.month}-01`;
            dataCreateSalaries[index].flag_protected = 0;
            dataCreateSalaries[index].type = itemCreate.type;
            dataCreateSalaries[index].status = itemCreate.status;
            dataCreateSalaries[index].paymentType = itemCreate.paymentType;
            dataCreateSalaries[index].companyWillPayMoney = this.computeCompanyWillPayMoney(itemCreate); //20
          }
        });
        if (dataCreateSalaries.length > 0) {
          await this.userSalariesEntity.bulkCreate(dataCreateSalaries);
        }
        if (!isNil(dataUpdateSalaries)) {
          let whereCondition: any = {
            userId: id
          }
          dataUpdateSalaries.forEach(async (item: any) => {
            whereCondition.month = item.month;
            whereCondition.year = item.year;
            whereCondition.departmentId = item.departmentId;
            const companyWillPayMoney = this.computeCompanyWillPayMoney(item); //20
            const dataUpdate = {
              bankId: item.bankId,
              bankName: item.bankName,
              dependent: item.dependent,
              paymentType: item.paymentType,
              salary: item.salary,
              socialInsuranceSalary: item.socialInsuranceSalary,
              type: item.type,
              status: item.status,
              companyWillPayMoney: companyWillPayMoney
            };
            await this.userSalariesEntity.update({ ...dataUpdate }, {
              where: { ...whereCondition }
            });
          })
        }
      }
      delete param.salaries;
      if (param.jobRankId) {
        await user.update({
          ...param,
        });
      } else {
        await user.update({
          ...param,
          jobRankId: null,
        });
      }
      return user;
    } catch (e) {
      throw UserNS.ERRORS.UserExisted;
    }
  }
  computeCompanyWillPayMoney(item: any): number {
    let companyWillPayMoney = 0;
    let companySocialInsurance = 0;
    let companyHealthInsurance = 0;
    let companyVoluntaryInsurance = 0;
    if (item.type === UserNS.Type.FULLTIMEC) {
      companySocialInsurance = Number((item.socialInsuranceSalary * 17.5 / 100).toFixed(0)); // 14
      companyHealthInsurance = Number((item.socialInsuranceSalary * 3 / 100).toFixed(0)); // 15
      companyVoluntaryInsurance = Number((item.socialInsuranceSalary / 100).toFixed(0)); // 16
    }
    companyWillPayMoney = item.salary + companySocialInsurance + companyHealthInsurance + companyVoluntaryInsurance; // 20
    return companyWillPayMoney;
  }
  async updateUserByEmail(email: string, param: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userEntity.findOne({
      where: {
        mail: email,
      },
    });
    if (isNil(user)) {
      return {} as UserEntity;
    }
    return user.update({
      ...param,
    });
  }

  async deleteUser(id: string): Promise<SuccessResponseDto> {
    const user = await this.userEntity.findByPk(id);
    if (isNil(user)) {
      return new SuccessResponseDto(false);
    }
    await user.destroy();
    return new SuccessResponseDto(true);
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userEntity.findOne({
      where: {
        username,
      },
    });
    if (isNil(user)) {
      return {} as UserEntity;
    }

    return user;
  }

  async getUserByDepartment(id: number): Promise<UserEntity[]> {
    const users = await this.userEntity.findAll({
      where: {
        departmentId: id,
      },
    });
    return users;
  }
  async getAll(): Promise<UserEntity[]> {
    const user = await this.userEntity.findAll();
    return user;
  }
  async updateRoleMember(id: string, role: UserNS.Roles): Promise<UserEntity> {
    const user = await this.userEntity.findByPk(id);
    if (isNil(user)) {
      throw UserNS.ERRORS.UserNotFound;
    }
    return await user.update({
      role,
    });
  }
  async getUserByRoleId(id: number): Promise<UserEntity[]> {
    return await this.userEntity.findAll({
      where: {
        roleId: id,
      },
    });
  }

  async updateRoleId(dto: DeleteRoleDto): Promise<number[]> {
    return await this.userEntity.update(
      { roleId: dto.newRoleId },
      {
        where: {
          roleId: dto.oldRoleId,
        },
      },
    );
  }

  async createUserIfNeed(user: GUser): Promise<UserDto> {
    const userInDB = await this.getUserByEmail(user.email);
    if (!isNil(userInDB)) {
      return userInDB;
    }

    const department = await this.departmentEntity.findOne({
      where: {
        [Op.and]: {
          deletedAt: null,
          flag_protected: FLAG_PROTECTED,
        },
      },
    });
    user = this.replaceUserGoogle(user);
    return await this.userEntity.create({
      id: user.sub,
      lineId: null,
      jobRankId: null,
      departmentId: department?.id,
      mail: user.email,
      displayName: user.family_name,
      givenName: user.given_name,
      surName: user.name,
      role: UserNS.Roles.MEMBER,
      roleId: 1,
      status: UserNS.Status.ACTIVE,
      username: user.email.split('@')[0],
      flagOnsite: 0,
    });
  }

  async updateUserIfNeed(user: GUser): Promise<Boolean> {
    try {
      user = this.replaceUserGoogle(user);
      let dataUpdate = {
        idGoogle: user.sub,
        // displayName: user.family_name,
        // givenName: user.given_name,
        // surName: user.name,
        // username: user.email.split('@')[0],
      }

      await this.userEntity.update({ ...dataUpdate }, {
        where: { mail: user.email }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  replaceUserGoogle(gUser: GUser): GUser {
    let user: GUser = gUser;
    const checkIndex = (gUser.name).indexOf('(');
    if (checkIndex !== -1) {
      user.name = (gUser.name).slice(0, checkIndex - 1);
      user.family_name = (user.name).slice((user.name).lastIndexOf(' ') + 1);
      user.given_name = (user.name).slice(0, (user.name).lastIndexOf(' '));
    }
    return user;
  }

  async getLineUsing(): Promise<LineUsingDto[]> {
    const results = await this.userEntity.findAll({
      where: {
        deletedAt: null
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('lineId')), 'lineId']],
    });
    return results;
  }

  async getRoleUsing(): Promise<RoleUsingDto[]> {
    const results = await this.userEntity.findAll({
      where: {
        deletedAt: null
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('roleId')), 'roleId']],
    });
    return results;
  }

  async getDepartmentUsing(): Promise<DepartmentUsingDto[]> {
    const resultProject = await this.projectEntity.findAll({
      where: {
        deletedAt: null
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('departmentId')), 'departmentId']],
    });

    const resultUser = await this.userEntity.findAll({
      where: {
        deletedAt: null
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('departmentId')), 'departmentId']],
    });

    return [...resultProject, ...resultUser];
  }

  async getUserSalary(param: GetSalaryDto): Promise<UserEntity[]> {
    const { condition, conditionSalary } = this.renderConditionSalary(param);

    return await this.userEntity.findAll({
      where: condition,
      offset: param.skip,
      limit: param.take,
      order: [
        ['displayName', 'ASC'],
        ['givenName', 'ASC'],
      ],
      include: [
        {
          model: UserSalariesEntity,
          paranoid: true,
          as: 'userSalaries',
          required: false,
          where: conditionSalary,
          include: [
            {
              model: DepartmentEntity,
              as: 'department',
              paranoid: false,
              attributes: ['id', 'name', 'deletedAt']
            },
          ]
        },
      ]
    });
  }

  async getUserSalaryPagging(param: UserSalaryPaggingFilterDto): Promise<PageDto<UserEntity>> {
    const { condition, conditionSalary } = this.renderConditionSalaryCost(param);

    const userSalaries = await this.userEntity.findAndCountAll({
      where: condition,
      offset: param.skip,
      limit: param.take,
      order: [['username', 'ASC']],
      include: [
        {
          model: UserSalariesEntity,
          paranoid: true,
          as: 'userSalaries',
          required: false,
          where: conditionSalary,
          order: [['date', 'DESC']],
        },
      ]
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: param, itemCount: userSalaries.count });
    const items = userSalaries.rows;
    return items.toPageDto(pageMetaDto);
  }

  async getUserSalaryCost(param: UserSalaryPaggingFilterDto): Promise<PageDto<UserPaggingDto>> {
    const { condition, conditionSalary } = this.renderConditionSalaryCost(param);

    let userSalaries = await this.userEntity.findAndCountAll({
      where: { [Op.or]: [{ flagOnsite: 1 }, condition] },
      offset: param.skip,
      limit: param.take,
      order: [['username', 'ASC']],
      include: [
        {
          model: UserSalariesEntity,
          paranoid: true,
          as: 'userSalaries',
          required: false,
          where: conditionSalary,
          order: [['date', 'DESC']],
        },
      ]
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: param, itemCount: userSalaries.count });
    const items = userSalaries.rows;
    return items.toPageDto(pageMetaDto);
  }

  async getUserForSalaryCost(param: GetSalaryCostDto): Promise<UserEntity[]> {
    const { departmentId, flagOnsite } = param;
    let condition: WhereOptions = {};

    if (departmentId && flagOnsite) {
      condition = { [Op.or]: [{ departmentId: departmentId }, { flagOnsite: flagOnsite }] };
    } else {
      if (departmentId) {
        condition.departmentId = departmentId;
      }
      if (flagOnsite) {
        condition.flagOnsite = flagOnsite;
      }
    }
    return await this.userEntity.findAll({
      where: condition,
      order: [['username', 'ASC']]
    });
  }

  async getCountUserSalary(param: GetSalaryDto): Promise<Number> {
    const { condition, conditionSalary } = this.renderConditionSalary(param);

    const count = await this.userEntity.count({
      where: condition,
      col: 'id'
    });

    return count;
  }

  renderConditionSalary(param: GetSalaryDto) {
    const { startDate, endDate, userIds, lineIds, divisionIds } = param;
    const condition: WhereOptions = {};
    const conditionSalary: WhereOptions = {};

    if (startDate && endDate) {
      conditionSalary.date = { [Op.between]: [startDate, `${endDate} 23:59:59`] };
    }

    if (userIds) {
      condition.id = { [Op.in]: userIds };
    }
    if (divisionIds) {
      condition.departmentId = { [Op.in]: divisionIds };
    }
    if (lineIds) {
      condition.lineId = { [Op.in]: lineIds };
    }
    return { condition, conditionSalary };
  }

  renderConditionSalaryCost(param: UserSalaryPaggingFilterDto) {
    const { month, year, userIds, lineIds, divisionId, departmentId, startDate, endDate } = param;
    const condition: WhereOptions = {};
    const conditionSalary: WhereOptions = {};

    if (startDate && endDate) {
      conditionSalary.date = { [Op.between]: [startDate, `${endDate} 23:59:59`] };
    }
    if (month) {
      conditionSalary.month = month;
    }
    if (year) {
      conditionSalary.year = year;
    }
    if (departmentId) {
      condition.departmentId = departmentId;
    }
    if (userIds) {
      condition.id = { [Op.in]: userIds };
    }
    if (divisionId) {
      condition.departmentId = divisionId;
    }
    if (lineIds) {
      condition.lineId = { [Op.in]: lineIds };
    }
    return { condition, conditionSalary };
  }

  async getUserByIds(ids: string[]): Promise<UserEntity[]> {
    return await this.userEntity.findAll({
      where: {
        id: { [Op.in]: ids }
      }
    });
  }

  async getOnlyUserById(id: string): Promise<UserEntity> {
    const user = await this.userEntity.findByPk(id);
    if (isNil(user)) {
      return {} as UserEntity;
    }
    return user;
  }

  async getUserFulltimeById(id: string): Promise<UserEntity> {
    const user = await this.userEntity.findOne({
      where: {
        [Op.and]: {
          id: id,
          status: UserNS.Status.ACTIVE,
          type: UserNS.Type.FULLTIMEC,
        },

      },
    });
    if (isNil(user)) {
      return {} as UserEntity;
    }
    return user;
  }

  async deleteDepartmentCost(id: string, year: number, month: number): Promise<SuccessResponseDto> {
    await this.userSalariesEntity.update({
      deletedAt: new Date()
    }, {
      where: {
        departmentId: id,
        year: year,
        month: month
      }
    });
    return new SuccessResponseDto(true);
  }

  async getDetailUserWithSalaries(param: GetSalaryDto): Promise<SalaryDto> {
    const { condition, conditionSalary } = this.renderConditionSalary(param);
    let userWSalaries = await this.userEntity.findOne({
      where: condition,
      include: [
        {
          model: LineEntity,
          as: 'line',
          paranoid: false,
          required: false,
          attributes: ['id', 'name', 'order', 'deletedAt'],
        },
        {
          model: DepartmentEntity,
          as: 'department',
          paranoid: false,
          required: false,
          attributes: ['id', 'name', 'deletedAt'],
        },
        {
          model: JobRankEntity,
          as: 'jobRank',
          paranoid: false,
          attributes: ['id', 'name', 'order', 'deletedAt'],
        },
      ]
    });
    if (isNil(userWSalaries)) {
      return {} as SalaryDto;
    }
    const salaries = await this.userSalariesEntity.findAll({
      where: { ...conditionSalary, departmentID: userWSalaries.departmentId, userId: userWSalaries.id }
    });
    userWSalaries.userSalaries = salaries;
    return userWSalaries.toDto();
  }

  async getListUserWithSalaries(param: GetSalaryDto): Promise<PageDto<UserDto>> {
    const { condition, conditionSalary } = this.renderConditionSalary(param);
    const userWSalaries = await this.userEntity.findAndCountAll({
      where: condition,
      include: [
        {
          model: UserSalariesEntity,
          paranoid: false,
          as: 'userSalaries',
          required: false,
          where: conditionSalary,
        },
        {
          model: LineEntity,
          as: 'line',
          paranoid: false,
          required: false,
          attributes: ['id', 'name', 'order', 'deletedAt'],
        },
        {
          model: DepartmentEntity,
          as: 'department',
          paranoid: false,
          required: false,
          attributes: ['id', 'name', 'deletedAt'],
        },
      ]
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: param, itemCount: userWSalaries.count });
    const items = userWSalaries.rows;
    return items.toPageDto(pageMetaDto);
  }

  async checkEmployeeExisted(param: CheckExitsEmployeeDto): Promise<Boolean> {
    const condition: WhereOptions = { employeeId: param.employeeId };
    if (param.userId) {
      condition.id = { [Op.not]: param.userId };
    }
    const user = await this.userEntity.findOne({
      where: condition
    });
    if (isNil(user) || !isNil(user.deletedAt)) {
      return false;
    }
    return true;
  }
}
