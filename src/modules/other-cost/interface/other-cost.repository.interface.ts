import { default as ProjectSituationEntity } from '../../../entities/project-situation.entity';
import { PageDto } from '../../../common/dto/page.dto';
import { Transaction } from 'sequelize';
import { CreateOtherCostDto } from '../dto/requests/create-other-cost.dto';
import { UpdateOtherCostDto } from '../dto/requests/update-other-cost.dto';
import { OtherCostDto } from '../dto/responses/other-cost.dto';
import { default as OtherCostEntity } from '../../../entities/other-cost.entity';
import { OtherCostFilterDto } from '../dto/requests/other-cost-filter.dto';
import { SettingOtherCostUsingDto } from '../dto/requests/setting-other-cost-using-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { FullUpdateOtherCostDto } from '../dto/requests/full-update-other-cost.dto';

export interface IOtherCostRepository {
    createOtherCost(createOtherCostDto: CreateOtherCostDto): Promise<OtherCostDto>;
    checkOtherCostExisted(createOtherCostDto: CreateOtherCostDto): Promise<Boolean>;
    checkExisted(createOtherCostDto: CreateOtherCostDto): Promise<Boolean>;
    updateOtherCost(otherCostId: number, updateOtherCostDto: UpdateOtherCostDto): Promise<SuccessResponseDto>;
    getOtherCost(params: OtherCostFilterDto): Promise<PageDto<OtherCostDto>>;
    getSettingOtherCostUsing(): Promise<SettingOtherCostUsingDto[]>;
    findById(otherCostId: number): Promise<OtherCostEntity>;
    deleteOtherCost(otherCostId: number): Promise<SuccessResponseDto>;
    fullUpdateOtherCost(params: FullUpdateOtherCostDto): Promise<SuccessResponseDto>;
    deleteDepartmentCost(id: string, year: number, month: number): Promise<SuccessResponseDto>;
}
