import { Inject } from '@nestjs/common';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { isNil } from 'lodash';
import { ProjectNS } from '../../modules/projects/interfaces/project';
import { Transaction } from 'sequelize';
import { default as UserProjectEntity } from '../../entities/user_project.entity';
import { CreateResourceDto } from '../../modules/resources/dto/requests/create-resource-dto';
import { CreateUserProjectDto } from './dto/requests/create-user-project-dto';
import { UserProjectNS } from './interfaces/user-project';
import { UserProjectDto } from './dto/responses/user-project-dto';
import { FilterUserSummaryDto } from '../../modules/resources/dto/requests/filter-user-summary-dto';

export class UserProjectService implements UserProjectNS.IUserProjectServices {
  constructor(
    @Inject('IUserProjectRepository')
    private readonly userProjectRepository: UserProjectNS.IUserProjectRepository,
    @Inject('IProjectService')
    private readonly projectService: ProjectNS.IProjectService,
  ) {}

  async checkDuplicate(createResourceDto: CreateResourceDto): Promise<string[]> {
    return await this.userProjectRepository.checkDuplicate(createResourceDto);
  }

  async findUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity | null> {
    const userProject = await this.userProjectRepository.findUserProject(params);
    return userProject;
  }

  async createUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity> {
    return await this.userProjectRepository.createUserProject(params);
  }

  async detailResourceUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity> {
    const userProject = await this.userProjectRepository.detailResourceUserProject(params);
    if (isNil(userProject)) {
      throw UserProjectNS.errMsg.UserProjectNotFound;
    }
    return userProject;
  }

  async getAllUserId(): Promise<string[]> {
    return await this.userProjectRepository.getAllUserId();
  }

  async getUserByProjectId(projectId: number): Promise<string[]> {
    return await this.userProjectRepository.getUserByProjectId(projectId);
  }

  async findById(id: number): Promise<UserProjectEntity | null> {
    return await this.userProjectRepository.findById(id);
  }

  async getUserProjectByProjectId(id: number): Promise<UserProjectEntity[]> {
    const userProject = await this.userProjectRepository.getUserProjectByProjectId(id);
    if (isNil(userProject)) {
      throw UserProjectNS.errMsg.UserProjectNotFound;
    }
    return userProject;
  }
  async getUserById(id: number): Promise<string[]> {
    return await this.userProjectRepository.getUserById(id);
  }
  async getUserProjectByProjectIdAndUserId(userId: string, projectId: number): Promise<number[]> {
    const userProject = await this.userProjectRepository.getUserProjectByProjectIdAndUserId(userId, projectId);
    const userProjectIds = userProject.map((u) => u.id);
    return userProjectIds;
  }

  async getAllUserIdWithProject(userId: string): Promise<string[]> {
    const projects = await this.projectService.getProjectOfUser(userId);
    const projectIds = projects.map((p) => p.id);
    return await this.userProjectRepository.getAllUserIdWithProject(projectIds);
  }
  async deleteUserProjectById(userProjectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.userProjectRepository.deleteUserProjectById(userProjectId, t);
  }

  async getMemberByProjectId(projectId: number): Promise<UserProjectDto[]> {
    const userProject = await this.userProjectRepository.getMemberByProjectId(projectId);
    return userProject.toDtos();
  }

  async deleteUserProjectByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.userProjectRepository.deleteUserProjectByProjectId(projectId, t);
  }
  async getUserInMonth(filterOptions: FilterUserSummaryDto): Promise<UserProjectEntity[]> {
    return await this.userProjectRepository.getUserInMonth(filterOptions);
  }
}
