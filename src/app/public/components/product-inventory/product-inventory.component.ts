import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SupplierModel } from 'src/app/models/supplier.model';
import { ProductService } from 'src/app/services/application/product/product.service';
import { SupplierService } from 'src/app/services/application/supplier/supplier.service';


@Component({
  selector: 'app-product-inventory',
  templateUrl: './product-inventory.component.html',
  styleUrls: ['./product-inventory.component.scss']
})
export class ProductInventoryComponent implements OnInit {

  pdfURL: string = '';
  isProgressBarShown: boolean = false;

  supplier_subscriotion!: Subscription;
  suppliers: Array<SupplierModel> = [{
    id: 0,
    supplier_name: 'ALL',
    contact_number: '',
    address: '',
    created_by: '',
    email: '',
    is_active: false
  }];
  status: Array<{label: string, value: string}> = [
    {label: 'ALL', value: 'ALL'},
    {label: 'AVAILABLE', value: 'AVAILABLE'},
    {label: 'OUT OF STOCK', value: 'OUT OF STOCK'}
  ];

  supplier_id: number = 0;
  status_type: string = '';

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService,
    private messageService: MessageService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit( ): void {
    this.status_type = this.status[0].value;
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplier_subscriotion = this.supplierService.showAllSupplier().subscribe({
      next: async (response: any) => {
        const supplier = await response.data;
        supplier.map((res: any) => {
          this.suppliers.push(res)
        })
        if(this.suppliers.length > 0) {
          this.supplier_id = this.suppliers[0].id as number;
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
    })
  }

  generate() {
    this.isProgressBarShown = true;
    let binaryData: any[] = [];
    this.productService
      .generateProductInventory(this.status_type, this.supplier_id)
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
              life: 2000,
              closable: false,
              icon: 'pi-exclamation-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            })
          }
        });
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application';
    this.router.navigateByUrl(returnUrl)
  }

}
