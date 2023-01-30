import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrderService } from 'src/app/services/application/order/order.service';

@Component({
  selector: 'app-sales-order-report',
  templateUrl: './sales-order-report.component.html',
  styleUrls: ['./sales-order-report.component.scss']
})
export class SalesOrderReportComponent implements OnInit {

  start_date: any = new Date();
  end_date: any = new Date();
  payment_type: string = '';
  order_status: string = '';
  payment_status: string = '';
  isProgressBarShown: boolean = false;
  pdfURL: string = '';

  payment_types: Array<{label: string, value: string}> = [
    {label: 'All', value: 'All'},
    {label: 'CHECK/PDC', value: 'CHECK/PDC'},
    {label: 'CASH', value: 'CASH'},
  ];

  order_statuses: Array<{label: string, value: string}> = [
    {label: 'All', value: 'ALL'},
    {label: 'CANCEL', value: 'CANCEL'},
    {label: 'COMPLETED', value: 'COMPLETED'}
  ];

  payment_statuses: Array<{label: string, value: string}> = [
    {label: 'All', value: 'all'},
    {label: 'PAID', value: 'PAID'},
    {label: 'PENDING', value: 'PENDING'}
  ]

  constructor(
    private datePipe: DatePipe,
    private orderService: OrderService,
    private messageService: MessageService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  generate() {

    this.isProgressBarShown = true;
    this.start_date = this.datePipe.transform(this.start_date, 'Y-MM-dd');
    this.end_date = this.datePipe.transform(this.end_date, 'Y-MM-dd');

    const data = {
      start_date: this.start_date,
      end_date: this.end_date,
      payment_type: this.payment_type,
      order_status: this.order_status,
      payment_status: this.payment_status
    }
    let binaryData: any[] = [];
    this.orderService
      .generateSalesOrder(data)
      .subscribe({
        next: (response: any) => {
          const data = response;
            setTimeout(() => {
              this.isProgressBarShown = false;
              binaryData.push(data);
              this.pdfURL = URL.createObjectURL(
                new Blob(binaryData, { type: 'application/pdf' })
              );
            }, 300);
          },
          error: (error) => {
            this.isProgressBarShown = false;
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.error.message,
              life: 1500,
              styleClass: 'text-700 bg-red-600 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            })
          }
        });
    
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application';
    this.router.navigateByUrl(returnUrl)
  }


}
