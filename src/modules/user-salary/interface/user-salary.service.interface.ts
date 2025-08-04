import { PageDto } from '../../../common/dto/page.dto';
import { Transaction } from 'sequelize';
import { CreateSalaryDto } from '../dto/requests/create-salary.dto';
import { UserSalaryDto } from '../dto/responses/user-salary.dto';
import { UserSalaryPaggingDto } from '../dto/responses/user-salary-paging.dto';
import { UpdateSalaryDto } from '../dto/requests/update-salary.dto';
import { UserSalaryFilterDto } from '../dto/requests/user-salary-filter.dto';
import { UserSalaryPaggingFilterDto } from '../dto/requests/user-salary-pagging-filter.dto';
import { CostManagementFilterDto } from '../dto/requests/cost-management-filter.dto';
import { FullUpdateSalaryDto } from '../dto/requests/full-update-salary.dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { ComputeSalaryParamsDto } from '../dto/requests/compute-salary-params.dto';
import { ComputeSalaryDto } from '../dto/responses/compute-salary.dto';


export interface IUserSalaryService {
    createSalary(createSalaryDto: CreateSalaryDto): Promise<UserSalaryDto>;
    updateSalary(salaryId: number, updateSalaryDto: UpdateSalaryDto): Promise<UserSalaryDto>;
    getSalaries(params: UserSalaryPaggingFilterDto): Promise<PageDto<UserSalaryPaggingDto>>;
    getCostManagement(costManagementFilterDto: CostManagementFilterDto): Promise<any>;
    getUserDefault(userId: string): Promise<UserSalaryPaggingDto>;
    fullUpdateSalaryDto(fullUpdateSalaryDto: FullUpdateSalaryDto): Promise<SuccessResponseDto>;
    checkExisted(params: UserSalaryPaggingFilterDto): Promise<Boolean>;
    clientCompute(salaryGross: string, insuranceSalary: string, type: string, dependentPerson: string): Promise<ComputeSalaryDto>;
    // handleCronSalary();
}
