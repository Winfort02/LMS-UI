import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryModel } from 'src/app/models/category.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/application/product/product.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PaginationModel } from 'src/app/models/pagination.model';

@Component({
  selector: 'app-product-query',
  templateUrl: './product-query.component.html',
  styleUrls: ['./product-query.component.scss']
})
export class ProductQueryComponent implements OnInit {
  
  imgUrl: string = `${environment.imgUrl}/storage/images/`;

  keywords: string = '';
  products: Array<ProductModel> = [];
  product_subscription!: Subscription;
  loading: boolean = true;
  lazyLoad!: LazyLoadEvent;
  supplier_id: number = 0;

  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  public firstPage() { this.getAllProducts(this.pagination.first); }
  public prevPage() { this.getAllProducts(this.pagination.prev); }
  public nextPage() { this.getAllProducts(this.pagination.next); }
  public lastPage() { this.getAllProducts(this.pagination.last); }

  ngOnInit(): void {
    this.loadConfigData();
  }

  loadConfigData() {
    if(this.dialogConfig.data) {
      this.supplier_id = this.dialogConfig.data;
    }
  }

  showProductLazyLoad(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllProducts(this.pagination.first);
  }

  getAllProducts(page: string) {
    this.loading = true;
    this.product_subscription = this.productService.showAllProductsBySupplierPagination(page, this.keywords, this.supplier_id).subscribe({
      next: async (response: any) => {
        // Pagination #2 
        this.pagination = response;
        this.page_detail = this.pagination.meta.current_page + ' / ' + this.pagination.meta.last_page;
        this.current_page = this.pagination.current_page;
        this.totalRecords = this.pagination.meta.total;
        // Pagination #2 

        this.products = this.pagination.data;
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

  search() {
    this.getAllProducts(this.pagination.first);
  }

  selectProduct(product: ProductModel) {
    this.dialogRef.close({ product: product });
  }


}
