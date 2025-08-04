import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { IUserSearch } from '../../interfaces/IUserSearch';
import { isNil, isObject, isString } from 'lodash';
import { AzureService } from '../../shared/services/azure.service';
import { UserDto } from './dto/response/user-dto';
import { UserNS } from './interface/users';
import { UsersRepository } from '../../repositories/users.repository';
import { default as UserEntity } from '../../entities/users.entity';
import { FilterUserSummaryDto } from '../../modules/resources/dto/requests/filter-user-summary-dto';
import { ProjectNS } from '../../modules/projects/interfaces/project';
import { ProjectDto } from '../../modules/projects/dto/responses/project-dto';
import { UserProjectNS } from '../../modules/user-projects/interfaces/user-project';
import { FilterUserAllowcationDto } from '../../modules/resources/dto/requests/filter-user-allocation-dto';
import { CreateUserDto } from './dto/request/create-user-dto';
import { UpdateUserDto } from './dto/request/update-user-dto';
import { SuccessResponseDto } from './../../common/dto/success.response.dto';
import { PageDto } from '../../common/dto/page.dto';
import { UserDivition } from './dto/request/user-search-division.dto';
import { MasterDataNS } from '../../modules/master-data/master-data';
import { PermissionNS } from '../../modules/permission/interfaces/permission';
import { PermissionMeDto } from '../../common/dto/permission.dto';
import { Routes } from '../../common/constants/menu-routes';
import { RoleService } from '../../modules/roles/role.service';
import { DeleteRoleDto } from '../../modules/roles/dto/request/confirm-delete-role-dto';
import { GUser } from 'interfaces/IUserGoogle';
import { LineUsingDto } from './dto/response/line-using-dto';
import { RoleUsingDto } from './dto/response/role-using-dto';
import { DepartmentUsingDto } from './dto/response/department-using-dto';
import { SalaryDto } from './dto/response/salary-dto';
import { GetSalaryDto } from './dto/request/get-salary-dto';
import { GetSalaryCostDto } from './dto/request/get-salary-cost-dto';
import { UserForSalaryCostDto } from './dto/response/users-for-salary-cost';
import { IOtherCostService } from '../../modules/other-cost/interface/other-cost.service.interface';
import { FullUpdateSalaryDto } from '../../modules/user-salary/dto/requests/full-update-salary.dto';
import { DepartmentDto, JobRankDto, LineDto } from '../../modules/master-data/dtos/master-data.dto';
import { UserSalaryService } from '../../modules/user-salary/user-salary.service';
import { CheckExitsEmployeeDto } from './dto/request/check-exits-employe-dto';
@Injectable()
export class UserService implements UserNS.IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UsersRepository,

    @Inject('IProjectService')
    private readonly projectService: ProjectNS.IProjectService,

    @Inject('IPermissionService') private readonly permissionService: PermissionNS.IPermissionService,

    @Inject(forwardRef(() => 'IMasterDataService')) private readonly masterDataService: MasterDataNS.IMasterDataService,

    @Inject('IRoleService') private readonly roleService: RoleService,

    @Inject('IUserProjectService')
    private readonly userProjectService: UserProjectNS.IUserProjectServices,
    private readonly azureService: AzureService,

    @Inject('IOtherCostService') private readonly otherCostService: IOtherCostService,
    @Inject('IUserSalaryService') private readonly userSalaryService: UserSalaryService,
  ) {}

  async getAllUser(search: IUserSearch, user: UserEntity): Promise<UserDto[]> {
    let users: UserDto[] = [];
    const userStore = !search.store ? UserNS.UserStore.AZURE : search.store;

    if (userStore === UserNS.UserStore.AZURE) {
      const usersEntity = await this.userRepository.listUserMasterData(search);
      users = usersEntity.map((user) => new UserDto(user));
      //users = await this.azureService.searchUsers(search);
    }
    if (userStore === UserNS.UserStore.MASTERDATA) {
      if (user.role === UserNS.Roles.MEMBER && search.option) {
        let userIds: Array<string> = [];
        const projects = await this.projectService.getAllProjectOfUser(user.id);
        await Promise.all(
          projects.map(async (p) => {
            const pms = p.pm ? JSON.parse(p.pm) : [];
            const isPm = pms.includes(user.username);
            if (isPm) {
              const userProjects = await this.userProjectService.getUserByProjectId(p.id);
              const userProjectsFilted = userProjects.filter((u) => !userIds.includes(u));
              userIds = [...userIds, ...userProjectsFilted];
            }
          }),
        );
        if (userIds.length !== +0) {
          userIds = [user.id, ...userIds.filter((id) => id !== user.id)];
        }
        users = await Promise.all(userIds.map(async (id) => new UserDto(await this.getUserById(id))));
      } else {
        const usersEntity = await this.userRepository.listUserMasterData(search);
        users = usersEntity.map((user) => new UserDto(user));
      }
    }
    return users;
  }

  async getUserDepartment(search: UserDivition, user: UserEntity): Promise<UserDto[] | PageDto<UserDto>> {
    let users;
    const role = await this.roleService.getRoleById(user.roleId);
    if (isNil(role)) {
      throw new ForbiddenException();
    }
    const userStore = !search.store ? UserNS.UserStore.AZURE : search.store;

    if (userStore === UserNS.UserStore.AZURE) {
      // users = await this.azureService.searchUsers(search);
      return users;
    }
    if (userStore === UserNS.UserStore.MASTERDATA) {
    //  console.log('search',search);
     // console.log('role',role);
      //console.log('user',user);
      users = await this.userRepository.getPaginationUsers(search, role, user);
      if(!isNil(users.data)) {
        users.data.forEach((ud: any) => {
          if(!isNil(ud.userSalaries)) {
            ud.userSalaries.forEach((us: any) => {
              us = this.userSalaryService.computeSalary(us);
            })
          }
        })
      }
    }
    return users;
  }
  async getUser(id: string, store: UserNS.UserStore, view?: string): Promise<UserDto> {
    let user: UserDto | undefined;
    const projectDtos: ProjectDto[] = [];
    if (store === UserNS.UserStore.AZURE) {
      // user = await this.azureService.getUserByID(id);
    }
    if (store === UserNS.UserStore.MASTERDATA) {
      const userEntity = await this.userRepository.getUserMasterData(id);
      if (view) {
        const projects = await this.projectService.getAllProjectOfUser();
        void Promise.all(
          projects.map((project) => {
            if (!isNil(project.pm)) {
              const isPm = project.pm.includes(userEntity.username as string);
              if (isPm) {
                projectDtos.push(project.toDto());
              }
            }
          }),
        );
        user = new UserDto(userEntity, projectDtos);
      } else {
        user = new UserDto(userEntity);
      }
    }
    if (isNil(user)) {
      throw UserNS.ERRORS.UserNotFound;
    }
    return user;
  }

  async getUserById(userID: string): Promise<UserEntity> {
    const user = await this.userRepository.getUserByID(userID);
    if (isNil(user)) {
      throw UserNS.ERRORS.UserNotFound;
    }
    return user;
  }

  async getUserByIds(userIds: string[]): Promise<UserEntity[]> {
    const users = await this.userRepository.getUserByIds(userIds);
    if (isNil(users)) {
      throw UserNS.ERRORS.UserNotFound;
    }
    return users;
  }
  async getUserByLineIds(userID: string, options: FilterUserSummaryDto): Promise<UserEntity> {
    const user = await this.userRepository.getUserByLineIds(userID, options);
    if (isNil(user)) {
      return {} as UserEntity;
    }
    return user;
  }

  async getUserAll(fields: Array<string>, filterOptions: FilterUserSummaryDto): Promise<UserEntity[]> {
    const userIds = await this.userRepository.getUserAll(fields, filterOptions);
    return userIds;
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw UserNS.ERRORS.UserNotFound;
    }
    const project = await this.projectService.getProjectForPm(email);
    const permission = await this.permissionService.getPermissionByRoleId(user.roleId);
    let action;
    const permissionDtos = permission.map((p) => {
      if (
        (p.name === Routes['Resources Member'][6].name ||
          p.name === Routes['Project List'][0].name ||
          p.name === Routes['Project Payment'][0].name) &&
        p.action === PermissionNS.ACTION.BLOCK
      ) {
        action = PermissionNS.ACTION.ONLY;
      } else {
        action = p.action;
      }
      const dto: PermissionMeDto = {
        name: p.name,
        path: p.path,
        method: p.method,
        action,
      };
      return dto;
    });
    return new UserDto(user, project, undefined, undefined, undefined, permissionDtos);
  }

  async getAllProjectOfUser(
    filterOptions: FilterUserAllowcationDto,
    options?: string,
    view?: string,
  ): Promise<UserEntity[]> {
    return await this.userRepository.getAllProjectOfUser(filterOptions, options, view);
  }

  async countUser(role: UserNS.Roles, dto: FilterUserAllowcationDto): Promise<number> {
    return await this.userRepository.countUser(role, dto);
  }

  async createUser(param: CreateUserDto): Promise<UserDto> {
    let jobRank: JobRankDto | undefined;
    if (param.jobRankId) {
      jobRank = await this.masterDataService.getMasterDataJobRank(param.jobRankId);
    }
    const line = await this.masterDataService.getMasterDataLine(param.lineId);
    const department = await this.masterDataService.getMasterDataDepartment(param.departmentId);
    const userDto = await this.userRepository.createUser(param);
    return new UserDto(userDto, undefined, line, jobRank, department);
  }

  async updateUser(id: string, param: UpdateUserDto): Promise<UserDto> {
    let jobRank: JobRankDto | undefined;
    let department: DepartmentDto | undefined;
    let line: LineDto | undefined;
    if (param.jobRankId) {
      jobRank = await this.masterDataService.getMasterDataJobRank(param.jobRankId);
    }
    if (param.departmentId) {
      department = await this.masterDataService.getMasterDataDepartment(param.departmentId);
    }
    if (param.lineId) {
      line = await this.masterDataService.getMasterDataLine(param.lineId);
    }
    const userDto = await this.userRepository.updateUser(id, param);
    return new UserDto(userDto, undefined, line, jobRank, department);
  }

  async updateUserByEmail(email: string, param: UpdateUserDto): Promise<UserDto> {
    return this.userRepository.updateUserByEmail(email, param);
  }

  async deleteUser(id: string): Promise<SuccessResponseDto> {
    return await this.userRepository.deleteUser(id);
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.getUserByUsername(username);
  }
  async getUserByDepartment(id: number): Promise<UserEntity[]> {
    return await this.userRepository.getUserByDepartment(id);
  }
  async getAllUserMM(): Promise<UserEntity[]> {
    return await this.userRepository.getAll();
  }
  async updateRoleMember(id: string, role: UserNS.Roles): Promise<UserEntity> {
    return await this.userRepository.updateRoleMember(id, role);
  }
  async getUserByRoleId(id: number): Promise<UserEntity[]> {
    return await this.userRepository.getUserByRoleId(id);
  }
  async updateRoleId(dto: DeleteRoleDto): Promise<number[]> {
    return await this.userRepository.updateRoleId(dto);
  }

  async createUserIfNeed(user: GUser): Promise<UserDto> {
    return await this.userRepository.createUserIfNeed(user);
  }

  async updateUserIfNeed(user: GUser): Promise<Boolean> {
    return await this.userRepository.updateUserIfNeed(user);
  }

  async getLineUsing(): Promise<LineUsingDto[]> {
    return await this.userRepository.getLineUsing();
  }

  async getRoleUsing(): Promise<RoleUsingDto[]> {
    return await this.userRepository.getRoleUsing();
  }

  async getDepartmentUsing(): Promise<DepartmentUsingDto[]> {
    return await this.userRepository.getDepartmentUsing();
  }

  async getUserSalary(param: any): Promise<object> {
    let usersEntity =  await this.userRepository.getUserSalary(param);
    let usersSalaries: {
      [userId: string]: {
        id: string,
        name: string,
        info: {
          [departmentId: string]: {
            departmentName: string,
            departmentInfo: [{
              month: number,
              year: number,
              salary: number | undefined
            }]
          }
        }

      }
    } = {};
    usersEntity.forEach((u) => {
      let usersInfoSalaries: {
        [departmentId: string]: {
          departmentName: string,
          departmentInfo: [{
            month: number,
            year: number,
            salary: number | undefined
          }]
        }
      } = {};
      if(!isNil(u.userSalaries)) {
        u.userSalaries.forEach((us) => {
          if(!isNil(us.departmentId)) {
            if(!usersInfoSalaries.hasOwnProperty(us.departmentId)) {
              usersInfoSalaries[us.departmentId] = {
                departmentName: us.department?.name??'',
                departmentInfo: [{
                  month: us.month,
                  year: us.year,
                  salary: us.companyWillPayMoney
                }]
              }
            } else {
              usersInfoSalaries[us.departmentId].departmentInfo.push({
                month: us.month,
                year: us.year,
                salary: us.companyWillPayMoney
              });
            }
          }
        });
      }
      if(!usersSalaries.hasOwnProperty(u.id)) {
        usersSalaries[u.id] = {
          id: u.id,
          name: u.surName??'',
          info: usersInfoSalaries
        }
      } else {
        usersSalaries[u.id].info = usersInfoSalaries;
      }
    });
    return usersSalaries;
  }

  async getCountUserSalary(param: GetSalaryDto): Promise<Number> {
    return  await this.userRepository.getCountUserSalary(param);
  }

  async getUserForSalaryCost(param: GetSalaryCostDto): Promise<UserForSalaryCostDto[]> {
    let usersEntity =  await this.userRepository.getUserForSalaryCost(param);
    let users: UserForSalaryCostDto[] = [];
    users = usersEntity.map((user) => new UserForSalaryCostDto(user));
    return users;
  }

  async deleteDepartmentSalaries(id: string, year: number, month: number): Promise<SuccessResponseDto> {
    const resSalary =  await this.userRepository.deleteDepartmentCost(id, year, month);
    const resOther = await this.otherCostService.deleteDepartmentCost(id, year, month);
    if(resSalary.success && resOther.success) {
      return new SuccessResponseDto(true);
    }
    return new SuccessResponseDto(false);
  }

  async getDetailUserWithSalaries(param: GetSalaryDto): Promise<SalaryDto> {
    let dataUS = await this.userRepository.getDetailUserWithSalaries(param);
    if(!isNil(dataUS.userSalaries)) {
      dataUS.userSalaries.forEach((us: any) => {
        us = this.userSalaryService.computeSalary(us);
      })
    }
    return dataUS;
  }

  async getListUserWithSalaries(param: GetSalaryDto): Promise<PageDto<UserDto>> {
    return  await this.userRepository.getListUserWithSalaries(param);
  }

  async checkEmployeeExisted(param: CheckExitsEmployeeDto): Promise<Boolean> {
    return  await this.userRepository.checkEmployeeExisted(param);
  }

}
