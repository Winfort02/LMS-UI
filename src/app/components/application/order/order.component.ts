import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { OrderModel } from 'src/app/models/order.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { OrderService } from 'src/app/services/application/order/order.service';
import { UpdateOrderDetailComponent } from '../update-order-detail/update-order-detail.component';
import { SalesOrderPdfComponent } from 'src/app/public/components/sales-order-pdf/sales-order-pdf.component';
import { CustomerModel } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  start_date: any = new Date();
  end_date: any = new Date();

  keywords: string = '';
  loading: boolean = true;
  customer_id: number = 0;
  sales_orders: Array<OrderModel> = [];
  customers: Array<CustomerModel> = [];
  sales_order_subscription!: Subscription;
  customer_subscription!: Subscription;
  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;
  lazyLoad!: LazyLoadEvent;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private activeRoute: ActivatedRoute,
    private customerService: CustomerService,
    private datePipe: DatePipe
  ) { }


  public firstPage() { this.getAllSalesOrder(this.pagination.first); }
  public prevPage() { this.getAllSalesOrder(this.pagination.prev); }
  public nextPage() { this.getAllSalesOrder(this.pagination.next); }
  public lastPage() { this.getAllSalesOrder(this.pagination.last); }

  ngOnInit(): void {
  }

  showAllSalesOrder(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.loadCustomer();
    this.getAllSalesOrder(this.pagination.first);
  }

  selectedCustomer() {
    this.getAllSalesOrder(this.pagination.first);
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
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        })
      }
    })
  }

  getAllSalesOrder(page: string) {
    this.loading = true;
    this.start_date = this.datePipe.transform(this.start_date, 'Y-MM-dd');
    this.end_date = this.datePipe.transform(this.end_date, 'Y-MM-dd');
    this.sales_order_subscription = this.orderService.showAllSalesOrderPaginate(page, this.keywords, this.customer_id, this.start_date, this.end_date).subscribe({
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

        this.sales_orders = this.pagination.data;
        this.loading = false;
      },
      error: async (error) => {
        this.messageService.add({
          severity: 'custom',
          detail: '' + error.error.message,
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.loading = false;
      }
    });
  }

  search() {
    this.showAllSalesOrder(this.lazyLoad);
  }

  createSalesOrder() {
    this.router.navigate(['/application/order-detail/' + 0], { queryParams: { returnUrl: `${this.router.url}`}});
  }

  viewReceipt(order: OrderModel) {
    this.orderService.generateSalesReport(order.id as number).subscribe(response => {
      const data = response;
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
    })
  }

  updateSalesOrder(order: OrderModel) {
    this.dialogRef = this.dialogService.open(UpdateOrderDetailComponent, {
      header: 'SALES ORDER DETAILS',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "max-width" : "480px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: order,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '75px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {
      if(response) {
        if(response.success) {
          if(response.code === 201) {
            this.messageService.add({
              severity: 'custom',
              detail: 'Order updated Successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            this.getAllSalesOrder(this.current_page);
          }
        } else {
          this.messageService.add({
            severity: 'custom',
            detail: '' + response.data,
            life: 1500,
            styleClass: 'text-700 bg-red-600 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllSalesOrder(this.current_page);
        }
      } else {
        return
      }
        
    })
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application';
    this.router.navigateByUrl(returnUrl)
  }

  onSelectDate() {
    this.getAllSalesOrder(this.pagination.first);
  }

  ngOnDestroy(): void {
    if(this.sales_order_subscription != null) this.sales_order_subscription.unsubscribe();
    if(this.customer_subscription != null) this.customer_subscription.unsubscribe();
  }

}
