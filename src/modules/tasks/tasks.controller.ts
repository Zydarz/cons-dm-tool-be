import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { UserNS } from '../users/interface/users';
import { TaskDto } from './dto/responses/task-dto';
import { TaskOptionsDto } from './dto/requests/tasks-filter-options.dto';
import { CreateTaskDto } from './dto/requests/create-task-dto';
import { TaskNS } from './interfaces/tasks-interface';
import { SuccessResponseDto } from './../../common/dto/success.response.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';
import { PageDto } from 'common/dto/page.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(@Inject('ITaskService') private readonly taskService: TaskNS.ITaskService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getTasks(
    @Query() params: TaskOptionsDto,
  ): Promise<PageDto<TaskDto>>  {
    return await this.taskService.getTasks(params);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async createUser(
    @AuthUser() user: UserEntity,
    @Body() params: CreateTaskDto ): Promise<SuccessResponseDto> {
    return this.taskService.createTask(params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  getUserByID(@Param('id') id: number): Promise<TaskDto | null> {
    return this.taskService.getDetailTask(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  updateUser(
    @AuthUser() user: UserEntity,
    @Param('id') id: number,
    @Body() param: CreateTaskDto): Promise<SuccessResponseDto> {
    return this.taskService.updateTask(id, param);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  deleteUser(@Param('id') id: number): Promise<SuccessResponseDto> {
    return this.taskService.deleteTask(id);
  }

}
