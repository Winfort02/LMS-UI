import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DatePipe, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderModel } from 'src/app/models/order.model';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/application/order/order.service';
import { PaymentModel } from 'src/app/models/payment.model';
import { PaymentService } from 'src/app/services/application/payments/payment.service';
import { PaymentHistoryModel } from 'src/app/models/payment-history.model';
import { PaymentHistoryService } from 'src/app/services/application/payments/payment-history.service';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {

  order: OrderModel = new OrderModel();

  payment_form: any = FormGroup;
  orders: Array<{label: string, value: number}> = []
  payment: PaymentModel = new PaymentModel();
  sales_orders!: Subscription;
  lastIndex: number = 0;

  payment_types: Array<{label: string, value: string}> = [
    {label: 'SELECT', value: ''},
    {label: 'CHECK', value: 'CHECK'},
    {label: 'CASH', value: 'CASH'},
    {label: 'PDC', value: 'PDC'},
  ]

  showDetails: boolean = false;

  componentShow: boolean = false;
  current_amount: number = 0;
  balance: number = 0;

  payment_history: Array<PaymentHistoryModel> = [];


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private orderService: OrderService,
    private activeRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private paymentHistoryService: PaymentHistoryService
  ) { }

  ngOnInit(): void {
    this.loadForm();
  }

  createSalesOrder() {
    this.router.navigate(['/application/order-detail/' + 0], { queryParams: { returnUrl: `${this.router.url}`}});
  }


  getRemainingBalance(current: any, previous: any, base_amount: any): number {

    const total: number = (parseInt(base_amount) + parseInt(current))- parseInt(previous);

    return total < 0 ? 0 : total;
  }


  loadForm() {
    this.payment_form = this.formBuilder.group({
      id: [this.payment.id],
      order_id: [this.payment.order_id, [Validators.required]],
      payment_type: [this.payment.payment_type, [Validators.required]],
      current_amount: [0, [Validators.required]],
      balance: [(this.payment.due_amount - this.payment.amount) > 0 ?  this.payment.due_amount - this.payment.amount : 0],
      payment_date: [this.payment.payment_date, [Validators.required]],
      amount: [this.payment.amount, [Validators.required]],
      remarks: [this.payment.remarks, [Validators.required]],
      status: [this.payment.status, [Validators.required]],
    });
    this.payment_form.controls.amount.disable();
    this.payment_form.controls.balance.disable();
    this.loadOrders();
  }
  
  loadOrders() {
    this.orders = [
      {label: 'SELECT', value: 0},
    ];
    this.sales_orders = this.orderService.showAllUnPaidOrder().subscribe({
      next: async (response: any) => {
        const orders = await response.data;
        orders.map((data: any) => {
          this.orders.push({label: data.sales_order_number, value: data.id});
        });

        this.loadDetails();
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


  loadDetails() {
    const payment_id = parseInt(this.activatedRoute.snapshot.params.id);
    this.payment.id = payment_id;
    if(this.payment.id as number != 0) {
      this.paymentService.getPaymentByID(payment_id).subscribe({
        next: async(response: any) => {
          const payment = response.data;
          this.payment = payment;
          this.current_amount = this.payment.amount;
          this.order = payment.order;
          this.orders = [
            {label: this.order.sales_order_number, value: this.order.id as number},
          ];
          this.payment_form.patchValue({
            id: this.payment.id,
            order_id: this.payment.order_id,
            payment_type: this.payment.payment_type,
            current_amount: 0,
            balance: (this.payment.due_amount - this.payment.amount) > 0 ?  this.payment.due_amount - this.payment.amount : 0,
            payment_date: this.payment.payment_date,
            amount: this.payment.amount,
            remarks: this.payment.remarks,
            status: this.payment.status ? true : false,
          });
          this.balance = (this.payment.due_amount - this.payment.amount) > 0 ?  this.payment.due_amount - this.payment.amount : 0;
          this.payment_form.controls.order_id.disable();
          this.payment_form.controls.balance.disable();
          this.payment_form.controls.amount.disable();

          if(!this.payment.status) {
            this.payment_form.disable();
          }
          this.loadPaymentHistory();
          this.showDetails = true;
          this.componentShow = true;
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
          this.componentShow = true;
          return
        }
      })
    } else {
      this.componentShow = true;
    }
  }


  loadOrderDetail(order_id: number) {
    if(order_id !== 0) {
      this.orderService.getOrderById(order_id).subscribe({
        next: async (response: any) => {
          const order = await response.data;
          this.order = order;
          this.showDetails = true;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'custom',
            detail: '' + error.error.message,
            life: 2000,
            closable: false,
            icon: 'pi pi-check-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-red-600 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          return
        }
      });
    } else {
      this.showDetails = false;
      return
    }
  }



  loadPaymentHistory(){
    this.paymentHistoryService.showPaymentsHistoryByPayment(this.payment.id as number).subscribe({
      next: async (response: any) => {
        const payment_history = await response.data;
        if(payment_history.length) {
          this.payment_history = payment_history;
          this.lastIndex = this.payment_history.length-1;
          return;
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'custom',
          detail: '' + error.error.message,
          life: 2000,
          closable: false,
          icon: 'pi pi-check-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        return;
      }
    })
  }

  checkValue(input: boolean): boolean {
    if(input) return true;

    return false;
  }

  createPayment() {

    if(this.payment_form.valid) {
      this.payment = this.payment_form.value;
      this.payment.customer_id = this.order.customer_id;
      this.payment.payment_date = this.datePipe.transform(this.payment.payment_date, 'Y-MM-dd');
      this.payment.due_amount = this.order.total_amount;

      if(this.payment.id == 0) {

        // if(this.payment.current_amount == 0)  {
        //   this.messageService.add({
        //     severity: 'custom',
        //     detail: 'Please enter amount greater than zero',
        //     life: 2000,
        //     closable: false,
        //     icon: 'pi-exclamation-circle text-lg mt-2 text-white',
        //     styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
        //     contentStyleClass: 'p-2 text-sm'
        //   })
        //   return;
        // }

        if(!this.checkValue(this.payment.status)) {
          this.messageService.add({
            severity: 'custom',
            detail: 'Unable to create payment with a cancel status',
            life: 2000,
            closable: false,
            icon: 'pi-exclamation-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          })
          return;
        }

        this.paymentService.createPayment(this.payment).subscribe({
          next: async (response: any) => {
            const payment = await response.data;
            this.payment = payment;
            this.location.go('/application/payments/detail/' + this.payment.id as string);
            location.reload()
            this.messageService.add({
              severity: 'custom',
              detail: 'Payments Added Successfully',
              life: 2000,
              closable: false,
              icon: 'pi pi-check-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
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
            })
            return
          }
        })
      } else {
        
        this.payment.order_id = this.order.id as number;
        if(parseFloat(this.payment_form.value.current_amount) > this.balance) {
          this.messageService.add({
            severity: 'custom',
            detail: 'Cannot add payment greater than balance amount .',
            life: 2000,
            closable: false,
            icon: 'pi-exclamation-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          })
          return
        }
        this.payment.amount = this.current_amount;
        this.paymentService.updatePayment(this.payment, this.payment.id as number).subscribe({
          next: async (response: any) => {
            this.loadDetails();
            this.messageService.add({
              severity: 'custom',
              detail: 'Payment updated successfully',
              life: 2000,
              closable: false,
              icon: 'pi pi-check-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });

            return;
          },
          error: (error) => {
            this.loadDetails();
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.error.message,
              life: 2000,
              closable: false,
              icon: 'pi-exclamation-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            })
            return
          }
        })
      }

    }
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application';
    this.router.navigateByUrl(returnUrl)
  }

  selectedOrder(event: any | number) {
    const id = event.value;
    this.loadOrderDetail(id);
  }


}
