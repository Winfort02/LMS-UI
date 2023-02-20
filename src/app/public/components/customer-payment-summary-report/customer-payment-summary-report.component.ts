import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomerModel } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { PaymentHistoryService } from 'src/app/services/application/payments/payment-history.service';

@Component({
  selector: 'app-customer-payment-summary-report',
  templateUrl: './customer-payment-summary-report.component.html',
  styleUrls: ['./customer-payment-summary-report.component.scss']
})
export class CustomerPaymentSummaryReportComponent implements OnInit {

  isComponentShow: boolean = false;

  customer_subscription!: Subscription;
  start_date: any = new Date();
  end_date: any = new Date();
  isProgressBarShown: boolean = false;
  isGenerated: boolean = false;
  pdfURL: string = '';
  customers: Array<CustomerModel> = [];
  customer_id: number = 0;

  constructor(
    private paymentHistoryService: PaymentHistoryService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    this.customer_subscription = this.customerService.showAllCustomer().subscribe({
      next: async (response: any) => {
        const customers = await response.data;
        this.customers = customers.map((data: any) => data);
        if(this.customers.length > 0) {
          this.isComponentShow = true;
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


  generate() {
    this.start_date = this.datePipe.transform(this.start_date, 'Y-MM-dd');
    this.end_date = this.datePipe.transform(this.end_date, 'Y-MM-dd');
    let binaryData: any[] = [];
    this.confirmationService.confirm({
      header: 'Generate Payment Report',
      message: 'Choose payment status CANCEL or ACTIVE',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-print',
      acceptLabel: 'Active',
      acceptButtonStyleClass: 'p-button-success p-button-raised text-xs',
      rejectIcon: 'pi pi-print',
      rejectButtonStyleClass: 'p-button-primary p-button-raised text-xs',
      rejectLabel: 'Cancel',
      accept: () => {
        this.isProgressBarShown = true;
        const data = {
          start_date: this.start_date,
          end_date: this.end_date,
          cancel: true,
          customer_id: this.customer_id
        }

        this.paymentHistoryService
        .generateCustomerPaymentReport(data)
        .subscribe({
        next: (response: any) => {
          const data = response;
            setTimeout(() => {
              this.isProgressBarShown = false;
              binaryData.push(data);
              this.pdfURL = URL.createObjectURL(
                new Blob(binaryData, { type: 'application/pdf' })
              );
              this.isGenerated = true;
            }, 300);
          },
          error: (error) => {
            this.isProgressBarShown = false;
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
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.CANCEL:
            this.confirmationService.close();
            break;
          case ConfirmEventType.REJECT:
            this.isProgressBarShown = true;

            const data = {
              start_date: this.start_date,
              end_date: this.end_date,
              cancel: false,
              customer_id: this.customer_id
            }
    
            this.paymentHistoryService
            .generateCustomerPaymentReport(data)
            .subscribe({
            next: (response: any) => {
              const data = response;
                setTimeout(() => {
                  this.isProgressBarShown = false;
                  binaryData.push(data);
                  this.pdfURL = URL.createObjectURL(
                    new Blob(binaryData, { type: 'application/pdf' })
                  );
                  this.isGenerated = true;
                }, 300);
              },
              error: (error) => {
                this.isProgressBarShown = false;
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
            });
            break;
        }
      }
    })
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application';
    this.router.navigateByUrl(returnUrl)
  }

}
