import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PageDto } from '../../../common/dto/page.dto';
import { IUserSearch } from '../../../interfaces/IUserSearch';
import { UserDto } from '../dto/response/user-dto';
import { default as UserEntity } from '../../../entities/users.entity';
import { FilterUserSummaryDto } from '../../resources/dto/requests/filter-user-summary-dto';
import { FilterUserAllowcationDto } from '../../resources/dto/requests/filter-user-allocation-dto';
import { CreateUserDto } from '../dto/request/create-user-dto';
import { UpdateUserDto } from '../dto/request/update-user-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { AzureUserDto } from '../dto/response/azure-user-dto';
import { UserDivition } from '../dto/request/user-search-division.dto';
import { default as RoleEntity } from '../../../entities/role.entity';
import { DeleteRoleDto } from '../../../modules/roles/dto/request/confirm-delete-role-dto';
import { GUser } from 'interfaces/IUserGoogle';
import { LineUsingDto } from '../dto/response/line-using-dto';
import { RoleUsingDto } from '../dto/response/role-using-dto';
import { DepartmentUsingDto } from '../dto/response/department-using-dto';
import { SalaryDto } from '../dto/response/salary-dto';
import { GetSalaryDto } from '../dto/request/get-salary-dto';
import { GetSalaryCostDto } from '../dto/request/get-salary-cost-dto';
import { UserForSalaryCostDto } from '../dto/response/users-for-salary-cost';
import { CheckExitsEmployeeDto } from '../dto/request/check-exits-employe-dto';
import { TimeSheetMemberDto } from '../dto/response/user-project-dto';
export namespace UserNS {
  export enum Roles {
    ADMIN = 'admin',
    LOS = 'los',
    MEMBER = 'member',
  }

  export enum RoleID {
    MEMBER = 1,
    ADMIN = 2,
    LOS = 3,
  }

  export enum Status {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    DISABLE = 'Deleted',
  }

  export const ALL = Object.values(Roles);

  export enum UserStore {
    MASTERDATA = 'masterdata',
    AZURE = 'azure',
  }
  export enum Type {
    FULLTIMEC = 'FullTimeC',
    FULLTIMET = 'FullTimeT',
    PARTTIME = 'PartTime',
    INTERN = 'Intern',
  }

  export enum PaymentType {
    CK = 'CK ngân hàng',
    TM = 'Tiền mặt'
  }

  export enum KeyPaymentType {
    CK = 'CK',
    TM = 'TM'
  }

  export const DOMAIN_USER = 'ominext.com';

  export interface IUserService {
    getAllUser(search: IUserSearch, user?: UserEntity): Promise<UserDto[]>;
    getUser(id: string, store: UserStore, view?: 'project'): Promise<UserDto>;
    getUserById(userID: string): Promise<UserEntity>;
    getUserByIds(userIds: string[]): Promise<UserEntity[]>;
    getUserByLineIds(userID: string, options: FilterUserSummaryDto): Promise<UserEntity>;
    getUserAll(fields: Array<string>, filterOptions: FilterUserSummaryDto): Promise<Partial<UserEntity>[]>;
    createUserIfNeed(user: GUser): Promise<UserDto>;
    updateUserIfNeed(user: GUser): Promise<Boolean>;
    getUserByEmail(email: string): Promise<UserDto>;
    getAllProjectOfUser(filterOptions: FilterUserAllowcationDto, option?: string, pm?: string): Promise<UserEntity[]>;
    getMemberByProjectId(ids: number[]): Promise<TimeSheetMemberDto[]>;
    countUser(role: UserNS.Roles, filterOptions: FilterUserAllowcationDto): Promise<number>;
    createUser(param: CreateUserDto): Promise<UserDto>;
    updateUser(id: string, param: UpdateUserDto): Promise<UserDto>;
    updateUserByEmail(email: string, param: UpdateUserDto): Promise<UserDto>;
    deleteUser(id: string): Promise<SuccessResponseDto>;
    getUserByUsername(username: string): Promise<UserEntity>;
    getUserByDepartment(id: number): Promise<UserEntity[]>;
    getAllUserMM(): Promise<UserEntity[]>;
    getUserDepartment(search: UserDivition, user: UserEntity): Promise<UserDto[] | PageDto<UserDto>>;
    updateRoleMember(id: string, role: UserNS.Roles): Promise<UserEntity>;
    getUserByRoleId(id: number): Promise<UserEntity[]>;
    updateRoleId(dto: DeleteRoleDto): Promise<number[]>;
    getLineUsing(): Promise<LineUsingDto[]>;
    getRoleUsing(): Promise<RoleUsingDto[]>;
    getDepartmentUsing(): Promise<DepartmentUsingDto[]>;
    getUserSalary(param: GetSalaryDto): Promise<object>;
    getUserForSalaryCost(param: GetSalaryDto): Promise<UserForSalaryCostDto[]>;
    getCountUserSalary(param: GetSalaryDto): Promise<Number>;
    deleteDepartmentSalaries(id: string, year: number, month: number): Promise<SuccessResponseDto>;
    getDetailUserWithSalaries(param: GetSalaryDto): Promise<SalaryDto>;
    getListUserWithSalaries(param: GetSalaryDto): Promise<PageDto<UserDto>>;
    checkEmployeeExisted(param: CheckExitsEmployeeDto): Promise<Boolean>;
  }

  export interface IUserRepository {
    getUserMasterData(userID: string): Promise<UserEntity>;
    listUserMasterData(search: IUserSearch): Promise<UserEntity[]>;
    getUserByID(id: string): Promise<UserEntity | null>;
    getUserByIds(userIds: string[]): Promise<UserEntity[]>;
    getUserByLineIds(id: string, options: FilterUserSummaryDto): Promise<UserEntity | null>;
    getUserAll(fields: Array<string>, filterOptions: FilterUserSummaryDto): Promise<UserEntity[]>;
    getUserByEmail(email: string): Promise<UserEntity | null>;
    getAllProjectOfUser(filterOptions: FilterUserAllowcationDto, option?: string, pm?: string): Promise<UserEntity[]>;
    getMemberByProjectId(ids: number[]): Promise<TimeSheetMemberDto[]>;
    countUser(role: UserNS.Roles, dto: FilterUserAllowcationDto): Promise<number>;
    createUser(user: AzureUserDto, param: CreateUserDto): Promise<UserEntity>;
    updateUser(id: string, param: UpdateUserDto): Promise<UserEntity>;
    updateUserByEmail(email: string, param: UpdateUserDto): Promise<UserEntity>;
    deleteUser(id: string): Promise<SuccessResponseDto>;
    getUserByUsername(username: string): Promise<UserEntity>;
    getUserByDepartment(id: number): Promise<UserEntity[]>;
    getAll(): Promise<UserEntity[]>;
    getPaginationUsers(search: UserDivition, role: RoleEntity, user: UserEntity): Promise<PageDto<UserDto>>;
    updateRoleMember(id: string, role: UserNS.Roles): Promise<UserEntity>;
    getUserByRoleId(id: number): Promise<UserEntity[]>;
    updateRoleId(dto: DeleteRoleDto): Promise<number[]>;
    createUserIfNeed(user: GUser): Promise<UserDto>;
    updateUserIfNeed(user: GUser): Promise<Boolean>;
    getLineUsing(): Promise<LineUsingDto[]>;
    getRoleUsing(): Promise<RoleUsingDto[]>;
    getDepartmentUsing(): Promise<DepartmentUsingDto[]>;
    getUserSalary(param: GetSalaryDto): Promise<UserEntity[]>;
    getUserForSalaryCost(param: GetSalaryCostDto): Promise<UserForSalaryCostDto[]>;
    getCountUserSalary(param: GetSalaryDto): Promise<Number>;
    deleteDepartmentCost(id: string, year: number, month: number): Promise<SuccessResponseDto>;
    getOnlyUserById(id: string): Promise<UserEntity>;
    getDetailUserWithSalaries(param: GetSalaryDto): Promise<SalaryDto>;
    getListUserWithSalaries(param: GetSalaryDto): Promise<PageDto<UserDto>>;
    checkEmployeeExisted(param: CheckExitsEmployeeDto): Promise<Boolean>;
  }

  export const dtos = {
    toUserDtos(userEntity?: UserEntity[]): UserDto[] {
      if (userEntity) {
        const userDtos = userEntity.map((u) => new UserDto(u));
        return userDtos;
      }
      return [];
    },
  };

  export const ERRORS = {
    UserNotFound: new NotFoundException('user.not.exist'),
    UserNotOmi: new UnauthorizedException('user not OMIGROUP. Please contact to Admin.'),
    UserExisted: new ConflictException('user Existed '),
  };
}
