import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { StockInModel } from 'src/app/models/stockIn.model';
import { SupplierModel } from 'src/app/models/supplier.model';
import { SupplierService } from 'src/app/services/application/supplier/supplier.service';
import { ProductQueryComponent } from 'src/app/public/components/product-query/product-query.component';
import { ProductModel } from 'src/app/models/product.model';
import { DatePipe, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModel } from 'src/app/models/user.model';
import { StockInService } from 'src/app/services/application/stock/stock-in.service';

@Component({
  selector: 'app-stock-in-detail',
  templateUrl: './stock-in-detail.component.html',
  styleUrls: ['./stock-in-detail.component.scss']
})
export class StockInDetailComponent implements OnInit {

  current_user: UserModel = new UserModel();
  showDetails: boolean = false;
  isComponentShown: boolean = false;
  supplier_subscriotion!: Subscription;
  stock_in_subscription!: Subscription;
  product: ProductModel = new ProductModel();
  suppliers: Array<SupplierModel> = [{
    id: 0,
    supplier_name: 'Select',
    contact_number: '',
    email: '',
    address: '',
    created_by: '',
    is_active: false
  }];
  stock_in_form: any = FormGroup;
  stock_in: StockInModel = new StockInModel();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private datePipe: DatePipe,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private stockInService: StockInService,
    private activeRoute: ActivatedRoute
  ) { 
    this.current_user = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.stock_in_form = this.formBuilder.group({
      id: [this.stock_in.id],
      supplier_id: [this.stock_in.supplier_id, [Validators.required]],
      product_id: [this.stock_in.product_id, [Validators.required]],
      user_id: [this.stock_in.user_id, [Validators.required]],
      transaction_number: [this.stock_in.transaction_number, [Validators.required]],
      van_number: [this.stock_in.van_number, [Validators.required]],
      date: [this.stock_in.date, [Validators.required]],
      quantity: [this.stock_in.quantity, [Validators.required]],
      status: [this.stock_in.status, [Validators.required]],
    });

    this.stock_in_form.controls.transaction_number.disable();

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
          await this.stock_in_form.patchValue({
            supplier_id: this.suppliers[0].id
          });
        }
        this.loadDetails();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'custom',
          detail: '' + error.error.message,
          life: 2000,
          closable: false,
          icon: 'pi pi-check-circle text-lg mt-2 text-white',
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        })
      }
    })
  }


  loadDetails() {
    if(this.activatedRoute.snapshot.params.id != 0) {
      const stock_in_id = this.activatedRoute.snapshot.params.id;
      this.stock_in_subscription = this.stockInService.getStockInById(stock_in_id).subscribe({
        next: async(response: any) => {
          const stock_in = response.data;
          if(stock_in !== null) {
            this.stock_in = stock_in;
            this.product = this.stock_in.product as ProductModel;
            this.stock_in.status = stock_in.status === 1 ? true : false;
            this.stock_in_form.patchValue({
              id: this.stock_in.id,
              supplier_id: this.stock_in.supplier_id,
              product_id: this.stock_in.product_id,
              user_id: this.stock_in.user_id,
              transaction_number: this.stock_in.transaction_number,
              van_number: this.stock_in.van_number,
              date: this.stock_in.date,
              quantity: this.stock_in.quantity,
              status: this.stock_in.status
            });
          }
          this.showDetails = true;
          this.isComponentShown = true;
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
          this.isComponentShown = true;
          return
        }
      })
    } else {
      this.isComponentShown = true;
    }
  }
  

  selectedSupplier(event: any) {
    if(event.value === 0) {
      this.showDetails = false;
    }
  }

  productQuery() {
    if(this.stock_in_form.value.supplier_id > 0) {
      this.dialogRef = this.dialogService.open(ProductQueryComponent, {
        header: 'Product Query',
        styleClass: 'text-sm text-primary',
        width: '75%',
        contentStyle: { "max-height": "600px", "max-width": "1100px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
        baseZIndex: 10000,
        data: this.stock_in_form.value.supplier_id,
        style: { 
          'align-self': 'flex-start', 
          'margin-top': '150px' 
        }
      });

      this.dialogRef.onClose.subscribe((response: any) => {
        if(response) {
          if(response.product) {
            this.product = response.product;
            this.stock_in_form.value.product_id = this.product.id as number;
            this.showDetails = true;
          }
        } else {
          return
        }
      });
    } else {
      this.messageService.add({
        severity: 'custom',
        detail: 'Please select supplier ',
        life: 2000,
        closable: false,
        icon: 'pi-exclamation-circle text-lg mt-2 text-white',
        styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
        contentStyleClass: 'p-2 text-sm'
      });
    }
  }

  save() {
    if(this.stock_in_form.valid) {
      this.stock_in = this.stock_in_form.value;
      this.stock_in.product_id = this.product.id as number;
      this.stock_in.user_id = this.current_user.id as number;
      this.stock_in.date = this.datePipe.transform(this.stock_in.date, 'Y-MM-dd');
      if(this.activatedRoute.snapshot.params.id == 0) {
        this.stockInService.createStockIn(this.stock_in).subscribe({
          next: async (response: any) => {
            this.stock_in = response.data;
            this.product = this.stock_in.product as ProductModel;
            this.stock_in_form.patchValue({
              id: this.stock_in.id,
              supplier_id: this.stock_in.supplier_id,
              product_id: this.stock_in.product_id,
              user_id: this.stock_in.user_id,
              transaction_number: this.stock_in.transaction_number,
              van_number: this.stock_in.van_number,
              date: this.stock_in.date,
              quantity: this.stock_in.quantity,
              status: this.stock_in.status
            });
            this.location.go(
              '/application/product/stock-in-detail/' + this.stock_in.id
            );
            this.messageService.add({
              severity: 'custom',
              detail: 'Stock added successfully',
              life: 2000,
              closable: false,
              icon: 'pi pi-check-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });
            
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
            });
            return
          }
        })
      } else {
        const stock_in_id = this.activatedRoute.snapshot.params.id;
        this.stockInService.updateStockIn(stock_in_id, this.stock_in).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Stock updated successfully',
              life: 2000,
              closable: false,
              icon: 'pi pi-check-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });
            this.loadDetails();
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
            });
            return
          }
        })
      }
    }
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application/product/stock-in';
    this.router.navigateByUrl(returnUrl)
  }

}
