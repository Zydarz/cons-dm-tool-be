import { Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { PageDto } from '../../common/dto/page.dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateTaskDto } from '../tasks/dto/requests/create-task-dto';
import { TaskOptionsDto } from './dto/requests/tasks-filter-options.dto';
import { TaskDto } from './dto/responses/task-dto';
import { TaskNS } from './interfaces/tasks-interface';
import { default as TaskEntity } from '../../entities/tasks.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class TasksService implements TaskNS.ITaskService {
  constructor(
    @Inject('ITaskRepository') private readonly taskRepository: TaskNS.ITaskRepository,
  ) { }
  async createTask(taskDto: CreateTaskDto): Promise<SuccessResponseDto> {
    await this.taskRepository.createTask(taskDto);

    return new SuccessResponseDto(true);
  }

  async getTasks(taskFilterOptionsDto: TaskOptionsDto): Promise<PageDto<TaskDto>> {
    return await this.taskRepository.getTasks(taskFilterOptionsDto);
  }

  async getDetailTask(taskId: number): Promise<TaskDto> {
    const task = await this.findById(taskId);
    return task.toDto();
  }

  async updateTask(taskId: number, taskDto: CreateTaskDto): Promise<SuccessResponseDto> {
    const task = await this.findById(taskId);
    return this.taskRepository.updateTask(task, taskDto);
  }




  async findById(taskId: number): Promise<TaskEntity> {
    const task = await this.taskRepository.getDetailTask(taskId);
    if (isNil(task)) {
      throw TaskNS.errMsg.TaskNotFound;
    }
    return task;
  }

  async deleteTask(taskId: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.taskRepository.deleteTask(taskId, t);
  }
}
