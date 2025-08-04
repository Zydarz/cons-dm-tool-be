import { CreateResourceDto } from '../../resources/dto/requests/create-resource-dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { default as UserProjectEntity } from '../../../entities/user_project.entity';
import { CreateUserProjectDto } from '../dto/requests/create-user-project-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';
import { UserProjectDto } from '../dto/responses/user-project-dto';
import { FilterUserSummaryDto } from '../../../modules/resources/dto/requests/filter-user-summary-dto';
export namespace UserProjectNS {
  export interface IUserProjectServices {
    checkDuplicate(createResourceDto: CreateResourceDto): Promise<string[]>;
    findUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity | null>;
    createUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity>;
    detailResourceUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity>;
    getAllUserId(): Promise<string[]>;
    getUserByProjectId(projectId: number): Promise<string[]>;
    findById(id: number): Promise<UserProjectEntity | null>;
    getUserProjectByProjectId(id: number): Promise<UserProjectEntity[]>;
    getUserById(id: number): Promise<string[]>;
    getUserProjectByProjectIdAndUserId(userId: string, projectId: number): Promise<number[]>;
    getAllUserIdWithProject(userId: string): Promise<string[]>;
    deleteUserProjectById(userProjectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getMemberByProjectId(projectId: number): Promise<UserProjectDto[]>;
    deleteUserProjectByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getUserInMonth(filterOptions: FilterUserSummaryDto): Promise<UserProjectEntity[]>;
  }

  export interface IUserProjectRepository {
    checkDuplicate(createResourceDto: CreateResourceDto): Promise<string[]>;
    findUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity | null>;
    createUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity>;
    detailResourceUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity | null>;
    getAllUserId(): Promise<string[]>;
    getUserByProjectId(projectId: number): Promise<string[]>;
    findById(id: number): Promise<UserProjectEntity | null>;
    getUserProjectByProjectId(id: number): Promise<UserProjectEntity[] | null>;
    getUserById(id: number): Promise<string[]>;
    getUserProjectByProjectIdAndUserId(userId: string, projectId: number): Promise<UserProjectEntity[]>;
    getAllUserIdWithProject(projectIds: number[]): Promise<string[]>;
    deleteUserProjectById(userProjectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getMemberByProjectId(projectId: number): Promise<UserProjectEntity[]>;
    deleteUserProjectByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getUserInMonth(filterOptions: FilterUserSummaryDto): Promise<UserProjectEntity[]>;
  }

  export const errMsg = {
    UserResourceExists: (users: Array<unknown>): ConflictException => new ConflictException(users),

    UserProjectNotFound: new NotFoundException('User Project Not Found'),
  };
}
