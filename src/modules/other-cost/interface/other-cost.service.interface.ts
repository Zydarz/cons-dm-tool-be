import { PageDto } from '../../../common/dto/page.dto';
import { Transaction } from 'sequelize';
import { CreateOtherCostDto } from '../dto/requests/create-other-cost.dto';
import { OtherCostDto } from '../dto/responses/other-cost.dto';
import { UpdateOtherCostDto } from '../dto/requests/update-other-cost.dto';
import { OtherCostFilterDto } from '../dto/requests/other-cost-filter.dto';
import { SettingOtherCostUsingDto } from '../dto/requests/setting-other-cost-using-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { FullUpdateOtherCostDto } from '../dto/requests/full-update-other-cost.dto';


export interface IOtherCostService {
    createOtherCost(createOtherCostDto: CreateOtherCostDto): Promise<OtherCostDto>;
    updateOtherCost(otherCostId: number, updateOtherCostDto: UpdateOtherCostDto): Promise<SuccessResponseDto>;
    deleteOtherCost(otherCostId: number): Promise<SuccessResponseDto>;
    getSettingOtherCostUsing(): Promise<Number[]>;
    getOtherCost(params: OtherCostFilterDto): Promise<PageDto<OtherCostDto>>;
    fullUpdateOtherCost(params: FullUpdateOtherCostDto): Promise<SuccessResponseDto>;
    deleteDepartmentCost(id: string, year: number, month: number): Promise<SuccessResponseDto>;
}
