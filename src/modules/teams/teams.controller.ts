import { ApiTags } from '@nestjs/swagger';
import { AzureService } from './../../shared/services/azure.service';
import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { SetChannelInformDtos } from './dto/requests/set-channe-inform.dto';
import { ITeamsService } from './interfaces/teams.service.interface';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { TeamLogsDto } from './dto/team-logs.dto';
import { Auth } from '../../decorators/http.decorators';
import { UserNS } from '../../modules/users/interface/users';

@ApiTags('Teams')
@Controller('teams')
export class TeamController {
  constructor(
    private azureService: AzureService,
    @Inject('ITeamsService') private readonly teamsService: ITeamsService,
  ) {}

  @Get('groups')
  @Auth(UserNS.ALL)
  async getAllChannelTeam() {
    return await this.azureService.getAllGroupJoined();
  }

  @Get('all-channels/:id')
  @Auth(UserNS.ALL)
  async getAllGroupInChannel(@Param('id') groupId: string) {
    return await this.azureService.getAllChannelInGroup(groupId);
  }

  @Post('set-channel-inform')
  @Auth(UserNS.ALL)
  async setChannelInform(@Body() dto: SetChannelInformDtos): Promise<SuccessResponseDto> {
    return await this.teamsService.setBotChannel(dto.data);
  }

  @Get('errors')
  @Auth(UserNS.ALL)
  async getErrorsFromTeam(@Query('limit') limit: number): Promise<TeamLogsDto[]> {
    return await this.teamsService.getErrorsFromTeam(limit);
  }
}
