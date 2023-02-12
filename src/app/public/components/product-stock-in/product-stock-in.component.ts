import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ProductModel } from 'src/app/models/product.model';
import { StockInModel } from 'src/app/models/stockIn.model';
import { StockInService } from 'src/app/services/application/stock/stock-in.service';

@Component({
  selector: 'app-product-stock-in',
  templateUrl: './product-stock-in.component.html',
  styleUrls: ['./product-stock-in.component.scss']
})
export class ProductStockInComponent implements OnInit, OnDestroy {

  @Input() product: ProductModel = new ProductModel();

  stocks: Array<StockInModel> = [];
  stock_in_subscription!: Subscription;

  lazyLoad!: LazyLoadEvent;
  keywords: string = '';
  loading: boolean = true;
  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;

  constructor(
    private stockInService: StockInService,
    private messageService: MessageService,
    private router: Router
  ) { }

  public firstPage() { this.getAllStockIn(this.pagination.first); }
  public prevPage() { this.getAllStockIn(this.pagination.prev); }
  public nextPage() { this.getAllStockIn(this.pagination.next); }
  public lastPage() { this.getAllStockIn(this.pagination.last); }

  ngOnInit(): void {
  }

  showStockInLazyLoad(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllStockIn(this.pagination.first);
  }

  getAllStockIn(page: string) {
    this.loading = true;
    this.stock_in_subscription = this.stockInService.showAllStockInByProductPaginate(page, this.keywords, this.product.id as number).subscribe({
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

        this.stocks = this.pagination.data;
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

  updateStocks(stock: StockInModel) {
    this.router.navigate(['/application/product/stock-in-detail/' + stock.id], { queryParams: { returnUrl: `${this.router.url}`}});
  }

  search() {
    this.getAllStockIn(this.pagination.first);
  }

  ngOnDestroy(): void {
    if(this.stock_in_subscription != null) this.stock_in_subscription.unsubscribe();
  }

}
