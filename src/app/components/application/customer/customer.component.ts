import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomerModel } from 'src/app/models/customer.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  keywords: string = '';
  lazyLoad!: LazyLoadEvent;
  loading: boolean = true;
  customers: Array<CustomerModel> = [];
  customer: CustomerModel = new CustomerModel();
  customer_subscription!: Subscription;
  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activeRoute: ActivatedRoute,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService
  ) { }


  public firstPage() { this.getAllCustomers(this.pagination.first); }
  public prevPage() { this.getAllCustomers(this.pagination.prev); }
  public nextPage() { this.getAllCustomers(this.pagination.next); }
  public lastPage() { this.getAllCustomers(this.pagination.last); }

  ngOnInit(): void {

  }

  showCustomerLazyLoad(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllCustomers(this.pagination.first);
  }

  getAllCustomers(page: string) {
    this.loading = true;
    this.customer_subscription = this.customerService.showAllCustomerPaginate(page, this.keywords).subscribe({
      next: async (response: any) => {

        this.pagination = response;
        this.pagination.meta = response.meta;
        this.pagination.first = response['links']['first'] != null ? response['links']['first'].split('?')[1] : null;
        this.pagination.prev = response['links']['prev'] != null ? response['links']['prev'].split('?')[1] : null;
        this.pagination.next = response['links']['next'] != null ? response['links']['next'].split('?')[1] : null;
        this.pagination.last = response['links']['last'] != null ? response['links']['last'].split('?')[1] : null;
        this.pagination.current_page = 'page=' + this.pagination.meta.current_page;
        this.page_detail = this.pagination.meta.current_page + ' / ' + this.pagination.meta.last_page;
        this.current_page = this.pagination.current_page;
        this.totalRecords = this.pagination.meta.total;
        // Pagination #2 

        this.customers = this.pagination.data;
        this.loading = false;
      },
      error: async (error) => {
        this.messageService.add({
          severity: 'custom',
          detail: '' + error.error.message,
          life: 2000,
          closable: false,
          icon: 'pi-exclamation-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        });
        this.loading = false;
      }
    });
  }

  search() {
    this.showCustomerLazyLoad(this.lazyLoad);
  }

  addCustomer() {
    this.dialogRef = this.dialogService.open(CustomerDetailComponent, {
      header: 'Customer Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: this.customer,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '75px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {
      if(response.success) {
        if(response.code === 201) {
          this.messageService.add({
            severity: 'custom',
            detail: 'New Customer Added Successfully',
            life: 2000,
            closable: false,
            icon: 'pi pi-check-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllCustomers(this.current_page);
        }
      } else {
        this.messageService.add({
          severity: 'custom',
          detail: '' + response.data,
          life: 2000,
          closable: false,
          icon: 'pi-exclamation-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        });
        this.getAllCustomers(this.current_page);
      }
        
    });
  }

  updateCustomer(customer: CustomerModel) {
    this.dialogRef = this.dialogService.open(CustomerDetailComponent, {
      header: 'Customer Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: customer,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '75px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {
      if(response.success) {
        if(response.code === 200) {
          this.messageService.add({
            severity: 'custom',
            detail: 'Customer Updated uccessfully',
            life: 2000,
            closable: false,
            icon: 'pi pi-check-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllCustomers(this.current_page);
        }
      } else {
        this.messageService.add({
          severity: 'custom',
          detail: '' + response.data,
          life: 2000,
          closable: false,
          icon: 'pi-exclamation-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        });
        this.getAllCustomers(this.current_page);
      }
        
    });
  }

  deleteCustomer(id: number) {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: 'Are you sure you want to delete this record ?',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-trash',
      acceptLabel: 'Delete',
      acceptButtonStyleClass: 'p-button-danger p-button-text text-xs',
      rejectButtonStyleClass: 'p-button-primary p-button-text text-xs',
      rejectLabel: 'Cancel',
      accept: () => {
        this.customerService.deleteCustomer(id).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Customer Deleted successfully',
              life: 2000,
              closable: false,
              icon: 'pi pi-check-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });

            // Pagination #5
            let dataLength = this.customers.length - 1;
            let current_page = dataLength == 0 ? this.pagination.prev : this.current_page;
            this.current_page = current_page;

            this.getAllCustomers(this.current_page);
          },
          error: async (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.message,
              life: 2000,
              closable: false,
              icon: 'pi-exclamation-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });
            return;
          }
        })
      }
    })
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application';
    this.router.navigateByUrl(returnUrl)
  }

}
