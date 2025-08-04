import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { PageDto } from '../../common/dto/page.dto';
import { UserNS } from '../../modules/users/interface/users';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';
import { IProjectSituationHistoryService } from './interfaces/project-situation-history.service.interface';
import { CreateProjectSituationHistoryDtos } from './dtos/requests/create-project-situation-history.dto';
import { ProjectSituationHistoryResponseDto } from './dtos/responses/project-situation-history.response.dto';

@ApiTags('Project Situations')
@Controller('project-situations')
export class ProjectSituationHistoryController {
  constructor(@Inject('IProjectSituationHistoryService') private readonly projectSituationService: IProjectSituationHistoryService) {}





}
