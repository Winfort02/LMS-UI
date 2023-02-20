import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryModel } from 'src/app/models/category.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { OrderService } from 'src/app/services/application/order/order.service';
import { OrderModel } from 'src/app/models/order.model';
import { CustomerModel } from 'src/app/models/customer.model';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-order-detail',
  templateUrl: './update-order-detail.component.html',
  styleUrls: ['./update-order-detail.component.scss']
})
export class UpdateOrderDetailComponent implements OnInit {

  orderForm: any = FormGroup
  order: OrderModel = new OrderModel();
  customer_subscription!: Subscription;
  payment: number = 0;

  customers: Array<{label: string, value: number}> = [
    {label : 'Select', value: 0},
  ];

  payment_types: Array<{label: string, value: string}> = [
    {label : 'Select', value: ''},
    {label : 'CASH', value: 'CASH'},
    {label : 'CHECK/PDC', value: 'CHECK/PDC'},
  ];

  order_statuses: Array<{label: string, value: string}> = [
    {label : 'Select', value: ''},
    {label : 'Completed', value: 'Completed'},
    {label : 'Cancel', value: 'Cancel'},
  ];

  sales_type: Array<{label: string, value: string}> = [
    {label : 'Select', value: ''},
    {label : 'CASH', value: 'CASH'},
    {label : 'CHARGE', value: 'CHARGE'},
    {label : 'DELIVERY', value: 'DELIVERY'},
  ];


  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadData();
  }


  loadData() {
    this.order = this.dialogConfig.data;
    this.order.status = this.order.status == true ? true : false;
    this.orderForm = this.formBuilder.group({
      id: [this.order.id],
      customer_id: [this.order.customer_id, [Validators.required]],
      sales_date: [this.order.sales_date, [Validators.required]],
      sales_type: [this.order.sales_type, [Validators.required]],
      order_status: [this.order.order_status, [Validators.required]],
      remarks: [this.order.remarks, [Validators.required]],
      status: [this.order.status, [Validators.required]]
    });
    this.loadCustomer();
  }

  loadCustomer() {
    this.customer_subscription = this.customerService.showAllCustomer().subscribe({
      next: async (response: any) => {
        const customer = await response.data;
        customer.map((res: any) => {
          this.customers.push({
            label: `${res.customer_name}`,
            value: res.id
          })
        })
        if(this.customers.length > 0) {
          await this.orderForm.patchValue({
            customer_id: this.order.customer_id,
            sales_date: this.order.sales_date,
            order_status: this.order.order_status,
            remarks: this.order.remarks,
            status: this.order.status
          });
        }
         // this.showProductLazyLoad(this.lazyLoad);
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

  save() {
    if(this.orderForm.valid) {
      this.order = this.orderForm.value;
      this.order.status = this.orderForm.value.status;
      this.order.sales_date = this.datePipe.transform(this.order.sales_date, 'Y-MM-dd');
      this.orderService.updateSalesOrder(this.order, this.order.id as number).subscribe({
        next: async (response: any) => {
          this.dialogRef.close({ data: await response.data, code: 201, success: true});
        },
        error: async (error) => {
          this.dialogRef.close({ data: await error.error.message, code: error.status, success: false});
          return
        }
      });
    }
  }

}
