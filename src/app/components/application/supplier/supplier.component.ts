import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { PaginationModel } from 'src/app/models/pagination.model';
import { SupplierModel } from 'src/app/models/supplier.model';
import { SupplierService } from 'src/app/services/application/supplier/supplier.service';
import { SupplierDetailComponent } from '../supplier-detail/supplier-detail.component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {


  keywords: string = '';
  loading: boolean = true;
  suppliers: Array<SupplierModel> = [];
  supplier: SupplierModel = new SupplierModel();
  supplier_subscription!: Subscription;
  lazyLoad!: LazyLoadEvent;
  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;

  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService
  ) { }


  public firstPage() { this.getAllSuppliers(this.pagination.first); }
  public prevPage() { this.getAllSuppliers(this.pagination.prev); }
  public nextPage() { this.getAllSuppliers(this.pagination.next); }
  public lastPage() { this.getAllSuppliers(this.pagination.last); }

  ngOnInit(): void {

  }

  showSupplierLazyLoad(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllSuppliers(this.pagination.first);
  }

  getAllSuppliers(page: string) {
    this.loading = true;
    this.supplier_subscription = this.supplierService.showAllSupplierPaginate(page, this.keywords).subscribe({
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

        this.suppliers = this.pagination.data;
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
    this.showSupplierLazyLoad(this.pagination.first);
  }

  addSupplier() {
    this.dialogRef = this.dialogService.open(SupplierDetailComponent, {
      header: 'Supplier Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: this.supplier,
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
            detail: 'New Supplier Added Successfully',
            life: 1500,
            styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllSuppliers(this.current_page);
        }
      } else {
        this.messageService.add({
          severity: 'custom',
          detail: '' + response.data,
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.getAllSuppliers(this.current_page);
      }
        
    })
  }

  updateSupplier(supplier: SupplierModel) {
    this.dialogRef = this.dialogService.open(SupplierDetailComponent, {
      header: 'Category Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: supplier,
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
            detail: 'New Supplier Updated Successfully',
            life: 1500,
            styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllSuppliers(this.current_page);
        }
      } else {
        this.messageService.add({
          severity: 'custom',
          detail: '' + response.data,
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.getAllSuppliers(this.current_page);
      }
        
    })
  }

  deleteSupplier(id: number) {
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
        this.supplierService.deleteSupplier(id).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Category Deleted successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });

            // Pagination #5
            let dataLength = this.suppliers.length - 1;
            let current_page = dataLength == 0 ? this.pagination.prev : this.current_page;
            this.current_page = current_page;

            this.getAllSuppliers(this.current_page);
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

}
