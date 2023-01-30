import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ProductModel } from 'src/app/models/product.model';
import { StockReturnModel } from 'src/app/models/stock-return.model';
import { StockReturnService } from 'src/app/services/application/stock/stock-return.service';

@Component({
  selector: 'app-product-stock-return',
  templateUrl: './product-stock-return.component.html',
  styleUrls: ['./product-stock-return.component.scss']
})
export class ProductStockReturnComponent implements OnInit, OnDestroy {

  @Input() product: ProductModel = new ProductModel();

  stocks: Array<StockReturnModel> = [];
  stock_return_subscription!: Subscription;

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
    private stockReturnService: StockReturnService,
    private messageService: MessageService,
    private router: Router
  ) { }


  public firstPage() { this.getAllStockReturn(this.pagination.first); }
  public prevPage() { this.getAllStockReturn(this.pagination.prev); }
  public nextPage() { this.getAllStockReturn(this.pagination.next); }
  public lastPage() { this.getAllStockReturn(this.pagination.last); }

  ngOnInit(): void {
  }

  showStockReturnLazyLoad(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllStockReturn(this.pagination.first);
  }


  getAllStockReturn(page: string) {
    this.loading = true;
    this.stock_return_subscription = this.stockReturnService.showAllStockReturnByProductPaginate(page, this.keywords, this.product.id as number).subscribe({
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
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.loading = false;
      }
    });
  }

  updateStockReturn(stock: StockReturnModel) {
    this.router.navigate(['/application/product/stock-return-detail/' + stock.id], { queryParams: { returnUrl: `${this.router.url}`}});
  }

  search() {
    this.getAllStockReturn(this.pagination.first);
  }

  ngOnDestroy(): void {
    if(this.stock_return_subscription != null) this.stock_return_subscription.unsubscribe();
  }

}
