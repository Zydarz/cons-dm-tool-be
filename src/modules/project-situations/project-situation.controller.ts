import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { PageDto } from '../../common/dto/page.dto';
import { IProjectSituationService } from './interfaces/project-situation.service.interface';
import { ProjectSituationDto } from './dtos/project-situation.dto';
import { CreateProjectSituationDtos } from './dtos/requests/create-project-situation.dto';
import { GetAllProjectSituationDto } from './dtos/requests/get-project-situations.dto';
import { DeleteProjectSituationDto } from './dtos/requests/delete-project-situation.dto';
import { EditProjectSituationDtos } from './dtos/requests/edit-project-situation.dto';
import { UserNS } from '../../modules/users/interface/users';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';
import { FilterDto } from './dtos/requests/filter-project-situation.dto';
import { ProjectSituationAllDto, ProjectSituationFlag } from './dtos/responses/project-situation-group.dto';
import { ProjectSituationResponseDto } from './dtos/responses/project-situation.response.dto';
import { updatedByProjectDto } from './dtos/responses/updated-by-project.response.dto';
import { projectSituationDetailDto } from './dtos/responses/project-situation-detail.response.dto';

@ApiTags('Project Situations')
@Controller('project-situations')
export class ProjectSituationController {
  constructor(@Inject('IProjectSituationService') private readonly projectSituationService: IProjectSituationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getAll(
    @Query(new ValidationPipe({ transform: true }))
    dto: GetAllProjectSituationDto,
  ): Promise<PageDto<ProjectSituationDto>> {
    return await this.projectSituationService.getAll(dto);
  }

  @Post('create_project_situation')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async createProjectSituation(
    @AuthUser() user: UserEntity,
    @Body()
    createProjectSitutionDto: CreateProjectSituationDtos,
  ): Promise<ProjectSituationResponseDto[]> {
    const { id, role, username } = user;
    return await this.projectSituationService.createProjectSituation(
      id,
      role as UserNS.Roles,
      createProjectSitutionDto,
      username,
    );
  }

  @Post('delete_project_situation')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async deleteProjectSituion(
    @Query(new ValidationPipe({ transform: true }))
    dto: DeleteProjectSituationDto,
    @AuthUser() user: UserEntity,
  ) {
    const { role, username } = user;
    return await this.projectSituationService.deleteProjectSituation(
      dto.id,
      dto.flag,
      role as UserNS.Roles,
      dto.delete,
      username,
    );
  }

  @Post('edit_project_situation')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async EditProjectSituion(@Body() dto: EditProjectSituationDtos, @AuthUser() user: UserEntity) {
    const { id, role, username } = user;
    return await this.projectSituationService.editProjectSituation(id, dto, role as UserNS.Roles, username);
  }

  @Get('filter-group')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getFilterByGroup(
    @Query(new ValidationPipe({ transform: true }))
    dto: FilterDto,
  ): Promise<ProjectSituationAllDto[] | PageDto<ProjectSituationFlag>> {
    console.log('dto', dto);
    return await this.projectSituationService.getProjectSituationByGroup(dto);
  }

  @Get('project/:projectId/updated')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getUpdatedByProject(
    @Param('projectId') projectId: number,
  ): Promise<updatedByProjectDto[]> {
    return await this.projectSituationService.getUpdatedByProject(projectId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async detailProject(@Param('id') id: number): Promise<projectSituationDetailDto> {
    return await this.projectSituationService.getProjectSituationbyId(id);
  }
}
