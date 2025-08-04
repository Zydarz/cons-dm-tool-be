import { default as ProjectSituationEntity } from '../../../entities/project-situation.entity';
import { PageDto } from '../../../common/dto/page.dto';
import { Transaction } from 'sequelize';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { CreateSalaryDto } from '../dto/requests/create-salary.dto';
import { UpdateSalaryDto } from '../dto/requests/update-salary.dto';
import { UserSalaryDto } from '../dto/responses/user-salary.dto';
import { UserSalaryPaggingDto } from '../dto/responses/user-salary-paging.dto';
import { default as UserSalariesEntity } from '../../../entities/user-salaries.entity';
import { UserSalaryFilterDto } from '../dto/requests/user-salary-filter.dto';
import { UserSalaryPaggingFilterDto } from '../dto/requests/user-salary-pagging-filter.dto';
import { FullUpdateSalaryDto } from '../dto/requests/full-update-salary.dto';
import { CostManagementFilterDto } from '../dto/requests/cost-management-filter.dto';
import { ManagementSalaryDto } from '../dto/responses/management-salary.dto';

export interface IUserSalaryRepository {
    createSalary(createProjectDto: CreateSalaryDto): Promise<UserSalaryDto>;
    checkSalaryExisted(createProjectDto: CreateSalaryDto): Promise<Boolean>
    updateSalary(salaryId: number, updateSalaryDto: UpdateSalaryDto): Promise<UserSalaryDto>;
    getSalaries(params: UserSalaryPaggingFilterDto): Promise<PageDto<UserSalaryPaggingDto>>;
    getAllSalaryLastMonth(): Promise<UserSalariesEntity[]>;
    setSalaryFlagProtected(salaryId: number): Promise<Boolean>;
    insertSalaries(dataInsert: any): Promise<Boolean>;
    updateSalaries(dataUpdate: object, whereUpdate: object): Promise<Boolean>
    getSalaryByUser(params: UserSalaryFilterDto): Promise<UserSalariesEntity[]>
    fullUpdateSalaryDto(fullUpdateSalaryDto: FullUpdateSalaryDto): Promise<SuccessResponseDto>;
    checkExisted(params: UserSalaryPaggingFilterDto): Promise<Boolean>
    getManagementSalaryCost(costManagementFilterDto: CostManagementFilterDto): Promise<ManagementSalaryDto[]> 
}
