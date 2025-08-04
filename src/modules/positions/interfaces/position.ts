import { NotFoundException } from '@nestjs/common';
import { MasterDataDto } from 'modules/master-data/dtos/master-data.dto';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { PageDto } from '../../../common/dto/page.dto';
export namespace PositionNS {
  export enum Code {
    ProjectManager = 'PM',
    Comtor = 'COM',
    BussinessAnalytic = 'BA',
    Designer = 'DESIGN',
    TesterLeader = 'TEST-L',
    TestManual = 'TEST',
    TestAutomation = 'TEST-A',
    TechnicalLeader = 'TECH-L',
    BackendDeveloperLeader = 'DEV-BE-L',
    BackendDeveloper = 'DEV-BE',
    FrontendDeveloperLead = 'DEV-FE-L',
    FrontendDeveloper = 'DEV-FE',
    MobileDeveloperLeader = 'DEV-M-L',
    MobileDeveloper = 'DEV-M',
    DevOpsLeader = 'DEVOPS-L',
    DevOps = 'DEVOPS',
    TeamLeader = 'TL',
  }
  export interface IPositionService {
    getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<MasterDataDto>>;
    getPosition(id: number): Promise<MasterDataDto>;
    getPositionByCode(code: Code): Promise<MasterDataDto>;
  }

  export interface IPositionRepository {
    getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<MasterDataDto>>;
    getPosition(id: number): Promise<MasterDataDto>;
    getPositionByCode(code: Code): Promise<MasterDataDto>;
  }

  export const errMsg = {
    ErrNotFound: new NotFoundException(),
  };
}
