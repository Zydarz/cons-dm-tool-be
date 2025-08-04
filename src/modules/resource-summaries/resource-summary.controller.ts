import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { IResourceSummaryService } from './interfaces/resource-summary.service.interface';
import { GetAllResourceSummaryDto } from './dtos/requests/get-all-resource-summary.dto';
import { UpdateResourceSummaryDto } from './dtos/requests/update-resource-summary.dto';
import { ResourceSummaryDto } from './dtos/resource-summary.dto';
import { default as ResourceSummaryEntity } from '../../entities/resource-summary.entity';
import { UserNS } from '../../modules/users/interface/users';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';

@ApiTags('Resource Summaries')
@Controller('resource-summaries')
export class ResourceSummaryController {
  constructor(@Inject('IResourceSummaryService') private readonly resourceSummaryService: IResourceSummaryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getAll(
    @Query(new ValidationPipe({ transform: true }))
    dto: GetAllResourceSummaryDto,
  ): Promise<ResourceSummaryEntity[]> {
    return await this.resourceSummaryService.getAll(dto.projectId);
  }

  @Post('edit_committed')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async updateCommited(
    @Body() dto: UpdateResourceSummaryDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResourceSummaryDto> {
    return await this.resourceSummaryService.updateResourceSummary(dto, user);
  }
}
