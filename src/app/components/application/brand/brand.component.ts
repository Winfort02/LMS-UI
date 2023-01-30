import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { BrandModel } from 'src/app/models/brand.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { BrandService } from 'src/app/services/application/brand/brand.service';
import { BrandDetailComponent } from '../brand-detail/brand-detail.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit, OnDestroy {

  keywords: string = '';
  loading: boolean = true;
  brands: Array<BrandModel> = [];
  lazyLoad!: LazyLoadEvent;
  brand_subscription!: Subscription;
  brand: BrandModel = new BrandModel();

  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;

  constructor(
    private brandService: BrandService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService
  ) { }


  public firstPage() { this.getAllBrands(this.pagination.first); }
  public prevPage() { this.getAllBrands(this.pagination.prev); }
  public nextPage() { this.getAllBrands(this.pagination.next); }
  public lastPage() { this.getAllBrands(this.pagination.last); }

  ngOnInit(): void {

  }

  showBrandLazyLoad(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllBrands(this.pagination.first);
  }

  getAllBrands(page: string) {
    this.loading = true;
    this.brand_subscription = this.brandService.showAllBrandPaginate(page, this.keywords).subscribe({
      next: async (response: any) => {

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

        this.brands = this.pagination.data;
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
    this.showBrandLazyLoad(this.lazyLoad);
  }

  addBrand() {
    this.dialogRef = this.dialogService.open(BrandDetailComponent, {
      header: 'Brand Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: this.brand,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '75px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {
      if(response.success) {
        if(response.code === 201) {
          this.messageService.add({
            severity: 'custom',
            detail: 'New brand Added Successfully',
            life: 1500,
            styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllBrands(this.current_page);
        }
      } else {
        this.messageService.add({
          severity: 'custom',
          detail: '' + response.data,
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.getAllBrands(this.current_page);
      }
        
    })
  }

  updateBrand(brand: BrandModel) {
    this.dialogRef = this.dialogService.open(BrandDetailComponent, {
      header: 'Brand Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: brand,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '75px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {
      if(response.success) {
        if(response.code === 201) {
          this.messageService.add({
            severity: 'custom',
            detail: 'New Brand Updated Successfully',
            life: 1500,
            styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllBrands(this.current_page);
        }
      } else {
        this.messageService.add({
          severity: 'custom',
          detail: '' + response.data,
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.getAllBrands(this.current_page);
      }
        
    })
  }

  deleteBrand(id: number) {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: 'Are you sure you want to delete this record ?',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-trash',
      acceptLabel: 'Delete',
      acceptButtonStyleClass: 'p-button-danger p-button-text text-xs',
      rejectButtonStyleClass: 'p-button-primary p-button-text text-xs',
      rejectLabel: 'Cancel',
      accept: () => {
        this.brandService.deleteBrand(id).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Category Deleted successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });

            // Pagination #5
            let dataLength = this.brands.length - 1;
            let current_page = dataLength == 0 ? this.pagination.prev : this.current_page;
            this.current_page = current_page;

            this.getAllBrands(this.current_page);
          },
          error: async (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.message,
              life: 1500,
              styleClass: 'text-700 bg-red-600 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            return;
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    if(this.brand_subscription != null) this.brand_subscription.unsubscribe();
  }

}
