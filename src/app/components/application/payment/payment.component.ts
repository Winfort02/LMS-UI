import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomerModel } from 'src/app/models/customer.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { PaymentModel } from 'src/app/models/payment.model';
import { SalesOrderPdfComponent } from 'src/app/public/components/sales-order-pdf/sales-order-pdf.component';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { PaymentService } from 'src/app/services/application/payments/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {

  start_date: any = new Date();
  end_date: any = new Date();

  keywords: string = '';
  customers: Array<CustomerModel> = [];
  customer_id: number = 0;
  payments: Array<PaymentModel> = [];
  loading:boolean = true;

  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;

  payment_subscription!: Subscription;
  customer_subscription!: Subscription;

  lazyLoad!: LazyLoadEvent;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private activeRoute: ActivatedRoute,
    private customerService: CustomerService,
    private datePipe: DatePipe,
    private paymentService: PaymentService
  ) { }


  public firstPage() { this.getAllPayments(this.pagination.first); }
  public prevPage() { this.getAllPayments(this.pagination.prev); }
  public nextPage() { this.getAllPayments(this.pagination.next); }
  public lastPage() { this.getAllPayments(this.pagination.last); }


  ngOnInit(): void {
  }

  loadCustomer() {
    this.customers = [
      {
        id: 0,
        customer_name: 'Select Customer',
        phone_number: '',
        address: '',
        email: '',
        created_by: '',
        gender: '',
        is_active: false
      }
    ];
    this.customer_subscription = this.customerService.showAllCustomer().subscribe({
      next: async (response: any) => {
        const categories = await response.data;

        categories.map((res: any) => {
          this.customers.push(res)
        })
        if(this.customers.length > 0) {
          this.customer_id = this.customers[0].id as number;
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'custom',
          detail: '' + error.error.message,
          life: 2000,
          closable: false,
          icon: 'pi-exclamation-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        })
      }
    })
  }

  getAllPayments(page: string) {
    this.loading = true;
    this.start_date = this.datePipe.transform(this.start_date, 'Y-MM-dd');
    this.end_date = this.datePipe.transform(this.end_date, 'Y-MM-dd');
    this.payment_subscription = this.paymentService.showAllPaymentPaginate(page, this.keywords, this.customer_id, this.start_date, this.end_date).subscribe({
      next: async (response: any) => {
        // Pagination #2 
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

        this.payments = this.pagination.data;
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


  onSelectDate() {
    this.getAllPayments(this.pagination.first);
  }


  selectedCustomer() {
    this.getAllPayments(this.pagination.first);
  }

  search() {
    this.getAllPayments(this.pagination.first);
  }

  generateReport() {

    this.confirmationService.confirm({
      header: 'Generate Payment Report',
      message: 'Do you want to include cancel payment ?',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-print',
      acceptLabel: 'Yes',
      acceptButtonStyleClass: 'p-button-success p-button-raised text-xs',
      rejectIcon: 'pi pi-print',
      rejectButtonStyleClass: 'p-button-primary p-button-raised text-xs',
      rejectLabel: 'No',
      accept: () => {
        const params = {
            start_date: this.datePipe.transform(this.start_date, 'Y-MM-dd'),
            end_date: this.datePipe.transform(this.end_date, 'Y-MM-dd'),
            cancel: true,
            customer_id: this.customer_id
        };
        this.paymentService.generatePaymentReport(params).subscribe({
          next: async(response: any) => {
            const data = await response;
            this.dialogRef = this.dialogService.open(
              SalesOrderPdfComponent,
              {
                header: 'SALES ORDER RECEIPT',
                width: '1200px',
                footer: ' ',
                contentStyle: {
                  'max-height': '650px',
                  'min-width': '475px',
                  'overflow-y': 'auto',
                },
                baseZIndex: 10000,
                data: { data: data },
              }
            );
            this.dialogRef.onClose.subscribe((data) => {
              return;
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.error.message,
              life: 2000,
              closable: false,
              icon: 'pi-exclamation-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });
            return;
          }
        })
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.CANCEL:
            this.confirmationService.close();
            break;

          case ConfirmEventType.REJECT:
            const params = {
              start_date: this.datePipe.transform(this.start_date, 'Y-MM-dd'),
              end_date: this.datePipe.transform(this.end_date, 'Y-MM-dd'),
              cancel: false,
              customer_id: this.customer_id
            };

            console.log(params)

            this.paymentService.generatePaymentReport(params).subscribe({
              next: async(response: any) => {
                const data = await response;
                this.dialogRef = this.dialogService.open(
                  SalesOrderPdfComponent,
                  {
                    header: 'SALES ORDER RECEIPT',
                    width: '1200px',
                    footer: ' ',
                    contentStyle: {
                      'max-height': '650px',
                      'min-width': '475px',
                      'overflow-y': 'auto',
                    },
                    baseZIndex: 10000,
                    data: { data: data },
                  }
                );
                this.dialogRef.onClose.subscribe((data) => {
                  return;
                });
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'custom',
                  detail: '' + error.error.message,
                  life: 2000,
                  closable: false,
                  icon: 'pi-exclamation-circle text-lg mt-2 text-white',
                  styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
                  contentStyleClass: 'p-2 text-sm'
                });
                return;
              }
            });
            break;
        }
      }
    })
  }

  createPayment() {
    this.router.navigate(['/application/payments/detail/' + 0], { queryParams: { returnUrl: `${this.router.url}`}});
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application';
    this.router.navigateByUrl(returnUrl)
  }

  showAllPayments(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.loadCustomer();
    this.getAllPayments(this.pagination.first);
  }

  updatePayment(payment: PaymentModel) {
    this.router.navigate(['/application/payments/detail/' + payment.id], { queryParams: { returnUrl: `${this.router.url}`}});
  }


  ngOnDestroy(): void {
    if(this.payment_subscription != null) this.payment_subscription.unsubscribe();
    if(this.customer_subscription != null) this.customer_subscription.unsubscribe();
  }

}
