import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CategoryModel } from 'src/app/models/category.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { CategoryService } from 'src/app/services/application/category/category.service';
import { CategoryDetailComponent } from '../category-detail/category-detail.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  keywords: string = '';
  lazyLoad!: LazyLoadEvent;
  loading: boolean = true;
  category: CategoryModel = new CategoryModel();
  categories: Array<CategoryModel> = [];
  categories_subscription!: Subscription;

  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService
  ) { }

  public firstPage() { this.getAllCategories(this.pagination.first); }
  public prevPage() { this.getAllCategories(this.pagination.prev); }
  public nextPage() { this.getAllCategories(this.pagination.next); }
  public lastPage() { this.getAllCategories(this.pagination.last); }

  ngOnInit(): void {
  }

  showCategoryLazyLoad(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllCategories(this.pagination.first);
  }

  getAllCategories(page: string) {
    this.loading = true;
    this.categories_subscription = this.categoryService.showAllCategoryPaginate(page, this.keywords).subscribe({
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

        this.categories = this.pagination.data;
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
    this.showCategoryLazyLoad(this.lazyLoad);
  }

  addCategory() {
    this.dialogRef = this.dialogService.open(CategoryDetailComponent, {
      header: 'Category Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: this.category,
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
            detail: 'New Category Added Successfully',
            life: 2000,
            closable: false,
            icon: 'pi pi-check-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllCategories(this.current_page);
        }
      } else {
        this.messageService.add({
          severity: 'custom',
          detail: '' + response.data,
          life: 2000,
          closable: false,
          icon: 'pi-exclamation-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
          contentStyleClass: 'p-2 text-sm'
        });
        this.getAllCategories(this.current_page);
      }
        
    })
  }

  updateCategory(category: CategoryModel) {
    this.dialogRef = this.dialogService.open(CategoryDetailComponent, {
      header: 'Category Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: category,
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
              severity: 'success',
              detail: 'New Category Updated Successfully',
              life: 2000,
              closable: false,
              icon: 'pi pi-check-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });
            this.getAllCategories(this.current_page);
          }
        } else {
          this.messageService.add({
            severity: 'custom',
            detail: '' + response.data,
            life: 2000,
            closable: false,
            icon: 'pi-exclamation-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllCategories(this.current_page);
        }
      } else {
        return
      }
        
    })
  }


  deleteCategory(id: number) {
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
        this.categoryService.deleteCategory(id).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Category Deleted successfully',
              life: 2000,
              closable: false,
              icon: 'pi pi-check-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });

            // Pagination #5
            let dataLength = this.categories.length - 1;
            let current_page = dataLength == 0 ? this.pagination.prev : this.current_page;
            this.current_page = current_page;

            this.getAllCategories(this.current_page);
          },
          error: async (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.message,
              life: 2000,
              closable: false,
              icon: 'pi-exclamation-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });
            return;
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    if(this.categories_subscription != null) this.categories_subscription.unsubscribe();
  }

}
