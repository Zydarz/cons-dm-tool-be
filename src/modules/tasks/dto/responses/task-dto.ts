import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as TaskEntity } from '../../../../entities/tasks.entity';

export class TaskDto extends AbstractDto {
  @ApiPropertyOptional()
  readonly taskId?: number;

  @ApiProperty({ maxLength: 3000 })
  readonly title: string;

  @ApiPropertyOptional()
  readonly description?: string;

  @ApiPropertyOptional()
  readonly projectId?: number;

  @ApiProperty()
  readonly createdBy: number;

  @ApiPropertyOptional()
  readonly assignee?: number;

  @ApiPropertyOptional()
  readonly effort?: number;

  @ApiPropertyOptional()
  readonly startDate?: Date;

  @ApiPropertyOptional()
  readonly endDate?: Date;

  @ApiPropertyOptional()
  readonly status?: number;

  @ApiPropertyOptional()
  readonly priority?: number;

  @ApiPropertyOptional()
  readonly deletedAt?: Date;

  constructor(taskEntity: TaskEntity) {
    super(taskEntity);
    this.taskId = taskEntity.taskId;
    this.title = taskEntity.title;
    this.description = taskEntity.description;
    this.projectId = taskEntity.projectId;
    this.createdBy = taskEntity.createdBy;
    this.assignee = taskEntity.assignee;
    this.effort = taskEntity.effort;
    this.startDate = taskEntity.startDate;
    this.endDate = taskEntity.endDate;
    this.status = taskEntity.status;
    this.priority = taskEntity.priority;
    this.deletedAt = taskEntity.deletedAt;
  }
}