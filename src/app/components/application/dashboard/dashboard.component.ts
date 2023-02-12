import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { OrderModel } from 'src/app/models/order.model';
import { DashboardService } from 'src/app/services/application/dashboard/dashboard.service';
import { ProductService } from 'src/app/services/application/product/product.service';
import { OrderService } from 'src/app/services/application/order/order.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SalesOrderPdfComponent } from 'src/app/public/components/sales-order-pdf/sales-order-pdf.component';
import { ProductModel } from 'src/app/models/product.model';
import { ThemeServiceService } from 'src/app/services/application/theme/theme-service.service';


interface counts {
  products: number,
  categories: number,
  suppliers: number,
  customers: number,
  current_sales: number,
  cash_sales: number,
  delivery_sales: number,
  charge_sales: number
}

interface YearlySales {
  label: Array<string>;
  cancel: Array<number>;
  completed: Array<number>
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  selected_year: any = new Date();
  current_date: any = new Date();
  product_subscription!: Subscription;
  latest_trans_subscription!: Subscription;
  products_subscription!: Subscription;
  loading: boolean = true;
  product_id: number = 0;
  lazyLoad!: LazyLoadEvent;
  sales_orders: Array<OrderModel> = [];
  products: Array<ProductModel> = [];

  product_list: Array<{label: string, value: number}> = [];

  counts: counts = {
    products: 0,
    categories: 0,
    suppliers: 0,
    customers: 0,
    current_sales: 0,
    cash_sales: 0,
    delivery_sales: 0,
    charge_sales: 0
  };

  yearly_sales: YearlySales = {
    label: [],
    cancel: [],
    completed: []
  }

  data: any;
  options: any;
  data_doughnut: any;
  doughnutOptions: any;

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
    private productService: ProductService,
    private messageService: MessageService,
    private orderService: OrderService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    public themeService: ThemeServiceService
  ) { }

  countAll() {
    this.dashboardService.countAll().subscribe({
      next: async (response: any) => {
        const counts = await response.data;
        this.counts = counts;
        this.generateYearlySales();
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
    });
  }

  selectedYear(e: any) {
    this.selected_year = this.datePipe.transform(this.current_date, 'yyyy');
    this.generateYearlySales()
  }

  selectedProduct() {
    this.generateProductStatus();
  }

  generateYearlySales() {
    this.selected_year = this.datePipe.transform(this.current_date, 'yyyy');
    this.dashboardService.generateearlySales(this.selected_year).subscribe({
      next: async(response:any) => {
        const yearlSales = await response.data;
        this.yearly_sales = yearlSales;

        this.data = {
          labels: yearlSales.label,
            datasets: [
              {
              label: 'CANCEL',
              data: yearlSales.cancel,
              tension: 0.4,
              backgroundColor: [
                '#B05A7A',
              ],
              borderColor: [
                '#B05A7A',
              ],
              borderWidth: 1
            },
            {
              label: 'COMPLETED',
              data: yearlSales.completed,
              tension: 0.4,
              backgroundColor: [
                '#1F8A70',
              ],
              borderColor: [
                '#1F8A70',
              ],
              borderWidth: 1
            }
          ]
        };

        this.options = {
          stacked: false,
          responsive: true,
          plugins: {
              title: {
                display: true,
                text: 'Monthly Sales in year ' + this.selected_year,
                font: {
                  size: '16',
                },
                color:  '#86A3B8'
              },
              legend: {
                  labels: {
                      color: '#86A3B8'
                  }
              },
          },
          scales: {
            x: {
                grid: {
                  offset: true,
                  display: true
                }
            },
            y: {
              grid: {
                display: true
              }
            }
          }
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
    });
    this.loadProducts()
  }

  loadProducts() {
    this.product_list = [
      {label: 'Select Product', value: 0}
    ];
    this.product_subscription = this.productService.showAllProducts().subscribe({
      next: async (response: any) => {
        const products = await response.data;
        const product = products.map((data: any) => ({
          label: `${data.product_name} ${data.description}`,
          value: data.id
        }))

        product.map((data: any) => {
          this.product_list.push(data)
        })
        if(this.product_list.length > 0) {
          this.product_id = this.product_list[0].value
        }

        this.generateProductStatus()
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

  generateProductStatus() {
    this.dashboardService.generateProductStatus(this.product_id).subscribe({
      next: async (response: any) => {
        const product_status = response.data;
        this.data_doughnut = {
          labels: product_status.label,
          datasets: [
            {
              label: 'Product Status',
              data: [product_status.on_hand, product_status.out_of_stock],
              borderJoinStyle: 'round',
              backgroundColor: ['#7B8FA1', '#205295'],
              borderColor: ['#7B8FA1', '#205295'],
              borderWidth: 0.5,
              cutout: '75%',
              hoverOffset: 1
            },
          ]
        };
    
        this.doughnutOptions = {
          responsive: true,
          animation: {
            animateScale: true,
            animateRotate: true
          },
          plugins: {
            layout: {
              padding: 10
            },
            legend: {
              position: 'bottom',
              display: true,
              labels: {
                boxWidth: 20,
                font: {
                  size: 12,
                },
                padding: 20,
                textAlign: 'center'
              }
            },
            title: {
              display: true,
              text: 'PRODUCT STATUS',
              position: 'top',
              font: {
                size: 15,
              },
              padding: 15
            },
          },
        };

        this.showAllProductWithLowQuantity();
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

  

  ngOnInit(): void {
   
    this.countAll();
  }

  showAllSalesOrder(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.latest_trans_subscription = this.dashboardService.showLatesTransaction().subscribe({
      next: async (response: any) => {
        const lates_order = response.data;
        this.sales_orders = lates_order;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'custom',
          detail: '' + error.error.message,
          life: 2000,
          closable: false,
          icon: 'pi-exclamation-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        });
      }
    })
  }

  showAllProductWithLowQuantity() {
    this.products_subscription = this.dashboardService.showProductLowQuantity().subscribe({
      next: async (response: any) => {
        const products = response.data;
        this.products = products;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'custom',
          detail: '' + error.error.message,
          life: 2000,
          closable: false,
          icon: 'pi-exclamation-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        });
      }
    })
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


  ngOnDestroy(): void {
    if(this.product_subscription != null) this.product_subscription.unsubscribe();
    if(this.latest_trans_subscription != null) this.latest_trans_subscription.unsubscribe();
    if(this.products_subscription != null) this.products_subscription.unsubscribe();
  }

}
