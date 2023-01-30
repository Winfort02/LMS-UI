import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PaginationModel } from 'src/app/models/pagination.model';
import { StockReturnModel } from 'src/app/models/stock-return.model';
import { StockReturnService } from 'src/app/services/application/stock/stock-return.service';

@Component({
  selector: 'app-stock-return',
  templateUrl: './stock-return.component.html',
  styleUrls: ['./stock-return.component.scss']
})
export class StockReturnComponent implements OnInit, OnDestroy {

  keywords: string = '';
  lazyLoad!: LazyLoadEvent;
  loading: boolean = true;
  stock_returns: Array<StockReturnModel> = [];
  stock_return_subscription!: Subscription;
  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;


  constructor(
    private router: Router,
    private stockReturnService: StockReturnService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
    this.stock_return_subscription = this.stockReturnService.showAllStockReturnPaginate(page, this.keywords).subscribe({
      next: async (response: any) => {
        console.log(response)
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

        this.stock_returns = this.pagination.data;
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
    this.showStockReturnLazyLoad(this.lazyLoad);
  }

  addStockReturn() {
    this.router.navigate(['/application/product/stock-return-detail/' + 0]);
  }

  updateStockReturn(stock: StockReturnModel) {
    this.router.navigate(['/application/product/stock-return-detail/' + stock.id]);
  }

  ngOnDestroy(): void {
    if(this.stock_return_subscription != null) this.stock_return_subscription.unsubscribe();
  }

}
