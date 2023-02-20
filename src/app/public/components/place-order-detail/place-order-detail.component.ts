import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderModel } from 'src/app/models/order.model';
import { OrderItemCartService } from 'src/app/services/application/order/order-item-cart.service';
import { OrderService } from 'src/app/services/application/order/order.service';

@Component({
  selector: 'app-place-order-detail',
  templateUrl: './place-order-detail.component.html',
  styleUrls: ['./place-order-detail.component.scss']
})
export class PlaceOrderDetailComponent implements OnInit {

  order: OrderModel = new OrderModel();

  total_payment: number = 0;
  change: number = 0;

  payment: number = 0;

  payment_types: Array<{label: string, value: string}> = [
    {label : 'Select', value: ''},
    {label : 'CASH', value: 'CASH'},
    {label : 'CHECK/PDC', value: 'CHECK/PDC'},
  ];

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private datePipe: DatePipe,
    private orderService: OrderService,
    private messageService: MessageService,
    private orderItemCartService: OrderItemCartService
  ) { }

  ngOnInit(): void {
    if(this.dialogConfig.data) {
      this.order = this.dialogConfig.data;
      this.order.sales_date = new Date();
      this.total_payment = this.order.total_amount;
      this.order.remarks = this.order.remarks == null ? '-' : this.order.remarks;
    }
  }

  calculate() {
    this.change = this.payment - this.total_payment;
  }


  checkOut() {

    this.order.sales_date = this.datePipe.transform(this.order.sales_date, 'Y-MM-dd');
    this.order.status = this.order.status ? true : false;
    this.order.cash = this.payment;
    this.orderService.createSalesOrder(this.order).subscribe({
      next: async (response: any) => {
        const order = await response.data;
        this.messageService.add({
          severity: 'custom',
          detail: 'Place order successfully',
          life: 2000,
          closable: false,
          icon: 'pi pi-check-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        });
        this.orderItemCartService.onClearCart();
        this.dialogRef.close({success: true , response: order })
      }, error: (error) => {
        this.messageService.add({
          severity: 'custom',
          detail: error.error.message,
          life: 2000,
          closable: false,
          icon: 'pi-exclamation-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        })
      }
    });
  }

}
