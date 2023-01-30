import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { StockInModel } from 'src/app/models/stockIn.model';
import { SupplierModel } from 'src/app/models/supplier.model';
import { SupplierService } from 'src/app/services/application/supplier/supplier.service';
import { ProductQueryComponent } from 'src/app/public/components/product-query/product-query.component';
import { DatePipe, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModel } from 'src/app/models/user.model';
import { StockInService } from 'src/app/services/application/stock/stock-in.service';
import { StockReturnModel } from 'src/app/models/stock-return.model';
import { ProductModel } from 'src/app/models/product.model';
import { StockReturnService } from 'src/app/services/application/stock/stock-return.service';

@Component({
  selector: 'app-stock-return-detail',
  templateUrl: './stock-return-detail.component.html',
  styleUrls: ['./stock-return-detail.component.scss']
})
export class StockReturnDetailComponent implements OnInit {

  current_user: UserModel = new UserModel();
  showDetails: boolean = false;
  isComponentShown: boolean = false;
  supplier_subscriotion!: Subscription;
  stock_return_subscription!: Subscription;
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
  stock_return_form: any = FormGroup;
  stock_return: StockReturnModel = new StockReturnModel();

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
    private stockReturnSerivice: StockReturnService,
    private activeRoute: ActivatedRoute
  ) { 
    this.current_user = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.stock_return_form = this.formBuilder.group({
      id: [this.stock_return.id],
      supplier_id: [this.stock_return.supplier_id, [Validators.required]],
      product_id: [this.stock_return.product_id, [Validators.required]],
      user_id: [this.stock_return.user_id, [Validators.required]],
      transaction_number: [this.stock_return.transaction_number, [Validators.required]],
      van_number: [this.stock_return.van_number, [Validators.required]],
      date: [this.stock_return.date, [Validators.required]],
      quantity: [this.stock_return.quantity, [Validators.required]],
      remarks: [this.stock_return.remarks, [Validators.required]],
    });

    this.stock_return_form.controls.transaction_number.disable();

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
          await this.stock_return_form.patchValue({
            supplier_id: this.suppliers[0].id
          });
        }
        this.loadDetails();
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

  loadDetails() {
    if(this.activatedRoute.snapshot.params.id != 0) {
      const stock_return_id = this.activatedRoute.snapshot.params.id;
      this.stock_return_subscription = this.stockReturnSerivice.getStockReturnById(stock_return_id).subscribe({
        next: async(response: any) => {
          const stock_return = response.data;
          if(stock_return !== null) {
            this.stock_return = stock_return;
            this.product = this.stock_return.product as ProductModel;
            this.stock_return_form.patchValue({
              id: this.stock_return.id,
              supplier_id: this.stock_return.supplier_id,
              product_id: this.stock_return.product_id,
              user_id: this.stock_return.user_id,
              transaction_number: this.stock_return.transaction_number,
              van_number: this.stock_return.van_number,
              date: this.stock_return.date,
              quantity: this.stock_return.quantity,
              remarks: this.stock_return.remarks
            });
          }
          this.showDetails = true;
          this.isComponentShown = true;
        },
        error: async (error) => {
          this.messageService.add({
            severity: 'custom',
            detail: '' + error.error.message,
            life: 1500,
            styleClass: 'text-700 bg-red-600 border-y-3 border-white',
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
    if(this.stock_return_form.value.supplier_id > 0) {
      this.dialogRef = this.dialogService.open(ProductQueryComponent, {
        header: 'Product Query',
        styleClass: 'text-sm text-primary',
        width: '75%',
        contentStyle: { "max-height": "600px", "max-width": "1100px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
        baseZIndex: 10000,
        data: this.stock_return_form.value.supplier_id,
        style: { 
          'align-self': 'flex-start', 
          'margin-top': '150px' 
        }
      });

      this.dialogRef.onClose.subscribe((response: any) => {
        if(response) {
          if(response.product) {
            this.product = response.product;
            this.stock_return_form.value.product_id = this.product.id as number;
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
        life: 1500,
        styleClass: 'text-700 bg-red-600 border-y-3 border-white',
        contentStyleClass: 'p-2 text-sm'
      });
    }
  }

  save() {
    if(this.stock_return_form.valid) {
      this.stock_return = this.stock_return_form.value;
      this.stock_return.product_id = this.product.id as number;
      this.stock_return.user_id = this.current_user.id as number;
      this.stock_return.date = this.datePipe.transform(this.stock_return.date, 'Y-MM-dd');
      if(this.activatedRoute.snapshot.params.id == 0) {
        this.stockReturnSerivice.createStockReturn(this.stock_return).subscribe({
          next: async (response: any) => {
            this.stock_return = response.data;
            this.product = this.stock_return.product as ProductModel;
            this.stock_return_form.patchValue({
              id: this.stock_return.id,
              supplier_id: this.stock_return.supplier_id,
              product_id: this.stock_return.product_id,
              user_id: this.stock_return.user_id,
              transaction_number: this.stock_return.transaction_number,
              van_number: this.stock_return.van_number,
              date: this.stock_return.date,
              quantity: this.stock_return.quantity,
              remarks: this.stock_return.remarks
            });
            this.location.go(
              '/application/product/stock-in-detail/' + this.stock_return.id
            );
            this.messageService.add({
              severity: 'custom',
              detail: 'Stock added successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            
          },
          error: (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.error.message,
              life: 1500,
              styleClass: 'text-700 bg-red-600 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            return
          }
        })
      } else {
        const stock_return_id = this.activatedRoute.snapshot.params.id;
        this.stockReturnSerivice.updateStockReturn(stock_return_id, this.stock_return).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Stock updated successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            this.loadDetails();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.error.message,
              life: 1500,
              styleClass: 'text-700 bg-red-600 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            return
          }
        })
      }
    }
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application/product/stock-return';
    this.router.navigateByUrl(returnUrl)
  }

}
