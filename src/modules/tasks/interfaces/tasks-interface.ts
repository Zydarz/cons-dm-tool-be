import { CreateTaskDto } from '../../tasks/dto/requests/create-task-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { TaskOptionsDto } from '../dto/requests/tasks-filter-options.dto';
import { PageDto } from '../../../common/dto/page.dto';
import { TaskDto } from '../dto/responses/task-dto';
import { default as TaskEntity } from '../../../entities/tasks.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from 'sequelize';

export namespace TaskNS {


  export interface ITaskService {
    createTask(taskDto: CreateTaskDto): Promise<SuccessResponseDto>;
    updateTask(taskId: number,  updateTaskDto: CreateTaskDto): Promise<SuccessResponseDto>;
    getDetailTask(taskId: number): Promise<TaskDto | null>;
    deleteTask(taskId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getTasks( taskOptionsDto: TaskOptionsDto): Promise<PageDto<TaskDto>>;
  }
  export interface ITaskRepository {
    createTask(taskDto: CreateTaskDto): Promise<SuccessResponseDto>;
    updateTask(task: TaskEntity, updateTaskDto: CreateTaskDto): Promise<SuccessResponseDto>;
    getDetailTask(taskId: number): Promise<TaskEntity | null>;
    deleteTask(taskId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getTasks(taskOptionsDto: TaskOptionsDto): Promise<PageDto<TaskDto>>;
  }

  export const errMsg = {
    TaskNotFound: new NotFoundException('Log Work Not Found'),
    UserPermission: new ForbiddenException('User Permission'),
  };
}
