import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/application/product/product.service';
import { StockReturnService } from 'src/app/services/application/stock/stock-return.service';
import { SupplierService } from 'src/app/services/application/supplier/supplier.service';

@Component({
  selector: 'app-stock-return-report',
  templateUrl: './stock-return-report.component.html',
  styleUrls: ['./stock-return-report.component.scss']
})
export class StockReturnReportComponent implements OnInit, OnDestroy {

  product_id: number = 0;
  supplier_id: number = 0;
  product_list: Array<{label: string, value: number}> = [];
  supplier_list: Array<{label: string, value: number}> = [];
  product_subscription!: Subscription;
  supplier_subscription!: Subscription;
  
  start_date: any = new Date();
  end_date: any = new Date();

  isProgressBarShown: boolean = false;
  pdfURL: string = '';

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private stockReturn: StockReturnService,
    private supplierService: SupplierService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.product_list = [
      {label: 'Select Product', value: 0}
    ];
    this.product_subscription = this.productService.showAllProducts().subscribe({
      next: async (response: any) => {
        const products = await response.data;
        const product = products.map((data: any) => ({
          label: data.product_name,
          value: data.id
        }))

        product.map((data: any) => {
          this.product_list.push(data)
        })
        if(this.product_list.length > 0) {
          this.product_id = this.product_list[0].value
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
    });

    this.loadSupplier();
  }


  loadSupplier() {
    this.supplier_list = [
      {label: 'Select Supplier', value: 0}
    ];
    this.supplier_subscription = this.supplierService.showAllSupplier().subscribe({
      next: async (response: any) => {
        const suppliers = await response.data;
        const supplier = suppliers.map((data: any) => ({
          label: data.supplier_name,
          value: data.id
        }))

        supplier.map((data: any) => {
          this.supplier_list.push(data)
        })
        if(this.product_list.length > 0) {
          this.supplier_id = this.product_list[0].value
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


  generate() {

    this.isProgressBarShown = true;
    this.start_date = this.datePipe.transform(this.start_date, 'Y-MM-dd');
    this.end_date = this.datePipe.transform(this.end_date, 'Y-MM-dd');

    const data = {
      start_date: this.start_date,
      end_date: this.end_date,
      supplier_id: this.supplier_id,
      product_id: this.product_id
    }
    let binaryData: any[] = [];
    this.stockReturn
      .generateStockReturnReport(data)
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

  ngOnDestroy(): void {
    if(this.product_subscription != null) this.product_subscription.unsubscribe();
    if(this.supplier_subscription != null) this.supplier_subscription.unsubscribe();
  }

}
