import { Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { PageDto } from '../../common/dto/page.dto';
import { CreateCustomerDto } from './dto/requests/create-customer-dto';
import { CustomerDto } from './dto/responses/customer-dto';
import { CustomerNS } from './interfaces/customer';
import { CustomerFilterDto } from './dto/requests/customer-filter-dto';
import { UpdateCustomerDto } from './dto/requests/update-customer-dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { ProjectNS } from '../../modules/projects/interfaces/project';
import { PaymentNS } from '../../modules/payment-tracking/interfaces/payment-tracking';

@Injectable()
export class CustomersService implements CustomerNS.ICustomerService {
  constructor(
    @Inject('ICustomerRepository') private readonly customerRepository: CustomerNS.ICustomerRepository,
    @Inject('IProjectService') private readonly projectService: ProjectNS.IProjectService,

    @Inject('IPaymentTrackingService') private readonly paymentService: PaymentNS.IPaymentTrackingService,
  ) {}

  async getAll(customerFilterDto: CustomerFilterDto): Promise<PageDto<CustomerDto>> {
    return await this.customerRepository.getAll(customerFilterDto);
  }
  async getCustomerById(id: number): Promise<boolean> {
    const customer = await this.customerRepository.findByPk(id);
    if (isNil(customer)) {
      return false;
    }
    return true;
  }

  async createCustomer(customerDto: CreateCustomerDto): Promise<CustomerDto> {
    return await this.customerRepository.createCustomer(customerDto);
  }

  async getCustomerDetail(id: number): Promise<CustomerDto> {
    const customer = await this.customerRepository.findByPk(id);

    if (isNil(customer)) {
      throw CustomerNS.errMsg.CustomerNotFound;
    }

    return customer.toDto();
  }

  async updateCustomer(id: number, payload: UpdateCustomerDto): Promise<CustomerDto> {
    return await this.customerRepository.updateCustomer(id, payload);
  }

  async deleteCustomer(id: number): Promise<SuccessResponseDto> {
    const customer = await this.customerRepository.findByPk(id);

    if (isNil(customer)) {
      throw CustomerNS.errMsg.CustomerNotFound;
    }

    const deleted = await this.customerRepository.deleteCustomer(id);
    if (deleted) {
      return await this.projectService.deleteCustomer(id);
    }
    return new SuccessResponseDto(false);
  }

  async getProjectsOfCustomer(customerId: number): Promise<unknown> {
    const customer = await this.getCustomerDetail(customerId);

    let totalPaidJPY = 0,
      totalPaidVND = 0,
      totalPaidUSD = 0;
    let totalProcessingJPY = 0,
      totalProcessingVND = 0,
      totalProcessingUSD = 0;

    const projectsOfCustomer = await this.projectService.getProjectsOfCustomer(customerId);

    const projects = await Promise.all(
      projectsOfCustomer.map(async (p) => {
        const paymentPaid = await this.paymentService.getTotalPaymentByProjectId(p.id, PaymentNS.Status.PAID);
        const paymentPending = await this.paymentService.getTotalPaymentByProjectId(p.id, PaymentNS.Status.PENDING);
        const paymentProcessing = await this.paymentService.getTotalPaymentByProjectId(
          p.id,
          PaymentNS.Status.PROCESSING,
        );

        switch (p.currency) {
          case ProjectNS.Currency.YEN:
            totalPaidJPY += paymentPaid;
            totalProcessingJPY += paymentPending + paymentProcessing;
            break;

          case ProjectNS.Currency.VND:
            totalPaidVND += paymentPaid;
            totalProcessingVND += paymentPending + paymentProcessing;
            break;
          case ProjectNS.Currency.DOLA:
            totalPaidUSD += paymentPaid;
            totalProcessingUSD += paymentPending + paymentProcessing;
            break;
        }

        return Object.assign(p, {
          paymentPaid,
          paymentProcessing: paymentPending + paymentProcessing,
        });
      }),
    );

    const totalPaid = [
      { totalPaidJPY, currency: ProjectNS.Currency.YEN },
      { totalPaidVND, currency: ProjectNS.Currency.VND },
      { totalPaidUSD, currency: ProjectNS.Currency.DOLA },
    ];
    const totalProcessing = [
      { totalProcessingJPY, currency: ProjectNS.Currency.YEN },
      { totalProcessingVND, currency: ProjectNS.Currency.VND },
      { totalProcessingUSD, currency: ProjectNS.Currency.DOLA },
    ];

    Object.assign(customer, {
      totalPaid,
      totalProcessing,
    });

    return {
      customer,
      projects,
    };
  }
}
