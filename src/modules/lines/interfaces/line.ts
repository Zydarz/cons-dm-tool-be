import { MasterDataDto } from '../../../modules/master-data/dtos/master-data.dto';

export namespace NSLine {
  export interface ILineService {
    getAll(): Promise<MasterDataDto[]>;
  }

  export interface ILineRepository {
    getAll(): Promise<MasterDataDto[]>;
  }
}
