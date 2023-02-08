import { DatePipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BrandModel } from 'src/app/models/brand.model';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { SupplierModel } from 'src/app/models/supplier.model';
import { UserModel } from 'src/app/models/user.model';
import { BrandService } from 'src/app/services/application/brand/brand.service';
import { CategoryService } from 'src/app/services/application/category/category.service';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { ProductService } from 'src/app/services/application/product/product.service';
import { SupplierService } from 'src/app/services/application/supplier/supplier.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  imgUrl: string = `${environment.imgUrl}/storage/images/`;

  imgSource: any = '';
  showImg: boolean = false;
  productForm: any = FormGroup;
  product: ProductModel = new ProductModel();
  current_user: UserModel = new UserModel();
  product_subscription!: Subscription;
  category_subscription!: Subscription;
  supplier_subscriotion!: Subscription;
  brand_subscription!: Subscription;
  isComponentShown: boolean = false;

  categories: Array<CategoryModel> = [];
  brands: Array<BrandModel> = [];
  suppliers: Array<SupplierModel> = [];

  units: Array<{label: string, value: string}> = [
    {label: 'Box', value: 'Box'},
    {label: 'Pcs', value: 'Pcs'},
    {label: 'Kg', value: 'Kg'},
    {label: 'Sacks', value: 'Sacks'},
    {label: 'Roll', value: 'Roll'},
    {label: 'Meter', value: 'Meter'},
    {label: 'Feet', value: 'Feet'},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private supplierService: SupplierService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private location: Location,
  ) { 
    this.current_user = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.productForm = this.formBuilder.group({
      id: [this.product.id],
      image: [null],
      category_id: [this.product.category_id, [Validators.required]],
      brand_id: [this.product.brand_id, [Validators.required]],
      supplier_id: [this.product.supplier_id, [Validators.required]],
      product_name: [this.product.product_name, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      base_price: [this.product.base_price, [Validators.required]],
      selling_price: [this.product.selling_price, [Validators.required]],
      quantity: [this.product.quantity, [Validators.required]],
      unit: [this.product.unit, [Validators.required]],
      created_by: [this.current_user.name],
      is_active: [this.product.is_active, [Validators.required]],
    });

    this.productForm.controls.created_by.disable();
    this.productForm.controls.quantity.disable();

    this.loadCategories();
  }

  loadCategories() {
    this.category_subscription = this.categoryService.showAllCategories().subscribe({
      next: async (response: any) => {
        this.categories = await response.data;
        if(this.categories.length > 0) {
          await this.productForm.patchValue({
            category_id: this.categories[0].id
          });
        }
        this.loadBrands();
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

  loadBrands() {
    this.brand_subscription = this.brandService.showAllBrands().subscribe({
      next: async (response: any) => {
        this.brands = await response.data;
        if(this.brands.length > 0) {
          await this.productForm.patchValue({
            brand_id: this.brands[0].id
          });
        }
        this.loadSuppliers();
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


  loadSuppliers() {
    this.supplier_subscriotion = this.supplierService.showAllSupplier().subscribe({
      next: async (response: any) => {
        this.suppliers = await response.data;
        if(this.suppliers.length > 0) {
          await this.productForm.patchValue({
            supplier_id: this.suppliers[0].id
          });
        }
        this.loadProductDetail();
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

  loadProductDetail() {

    if(this.activatedRoute.snapshot.params.id > 0) {
      const product_id = this.activatedRoute.snapshot.params.id;
      this.product_subscription = this.productService.getProductById(product_id).subscribe({
        next: async(response: any) => {
          const product = response.data;
          if(product !== null) {
            this.product = product;
            this.showImg = true;
            this.imgSource = this.imgUrl + product.image;
            this.product.is_active = product.is_active == 1 ? true : false;
            this.productForm.patchValue({
              id: this.product.id,
              brand_id: this.product.brand_id,
              supplier_id: this.product.supplier_id,
              product_name: this.product.product_name,
              description: this.product.description,
              base_price: this.product.base_price,
              selling_price: this.product.selling_price,
              quantity: this.product.quantity,
              unit: this.product.unit,
              is_active: this.product.is_active
            });
          }
          
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

  save() {
    if(this.productForm.valid) {
      if(this.activatedRoute.snapshot.params.id == 0) {
        const form_data: FormData = new FormData();
        Object.keys(this.productForm.controls).forEach(formControlName => {
          form_data.append(formControlName,
          this.productForm.get(formControlName).value);
        })
        this.productService.createProduct(form_data).subscribe({
          next: (response: any) => {
            const product = response.data;
            this.messageService.add({
              severity: 'custom',
              detail: 'New Product Added Successfully',
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            this.location.go(
              '/application/product-detail/' + product.id
            );
            this.loadProductDetail();
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
        });
      } else {
        const form_data: FormData = new FormData();
        Object.keys(this.productForm.controls).forEach(formControlName => {
          form_data.append(formControlName,
          this.productForm.get(formControlName).value);
        });
        form_data.append('_method', 'PUT');
        this.productService.updateProduct(this.product.id as number, form_data).subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Product Updated Successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            this.loadProductDetail();
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
        });
      }
      
    }
  }


  close() {
    this.router.navigate(['/application/products']);
  }

  uploadFile(event: any) {
    if(event.target.files) {
      const file = (event.target as HTMLInputElement | any).files[0]
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => { 
        this.imgSource = e.target.result;
        if(this.imgSource !== null) {
          this.showImg = true;
          this.productForm.patchValue({
            image: <HTMLInputElement>file
          });
          this.productForm.get('image').updateValueAndValidity();
        }
      }
    }
  }


  ngOnDestroy(): void {
    if(this.supplier_subscriotion != null) this.supplier_subscriotion.unsubscribe();
    if(this.category_subscription != null) this.category_subscription.unsubscribe();
    if(this.brand_subscription != null) this.brand_subscription.unsubscribe();
    if(this.product_subscription != null) this.product_subscription.unsubscribe();
  }

}
