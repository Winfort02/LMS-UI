import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrderService } from 'src/app/services/application/order/order.service';

@Component({
  selector: 'app-sales-order-item-summary-report',
  templateUrl: './sales-order-item-summary-report.component.html',
  styleUrls: ['./sales-order-item-summary-report.component.scss']
})
export class SalesOrderItemSummaryReportComponent implements OnInit {

  start_date: any = new Date();
  end_date: any = new Date();
  isProgressBarShown: boolean = false;
  pdfURL: string = '';

  constructor(
    private orderService: OrderService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  generate() {
    this.isProgressBarShown = true;
    this.start_date = this.datePipe.transform(this.start_date, 'Y-MM-dd');
    this.end_date = this.datePipe.transform(this.end_date, 'Y-MM-dd');

    const data = {
      start_date: this.start_date,
      end_date: this.end_date
    }
    let binaryData: any[] = [];
    this.orderService
      .generateSalesOrderItemSummaryReport(data)
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
              life: 2000,
              closable: false,
              icon: 'pi-exclamation-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
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
