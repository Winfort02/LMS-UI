import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CategoryModel } from 'src/app/models/category.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ProductModel } from 'src/app/models/product.model';
import { UserModel } from 'src/app/models/user.model';
import { CategoryService } from 'src/app/services/application/category/category.service';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { ProductService } from 'src/app/services/application/product/product.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ProductInformationComponent } from '../product-information/product-information.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  imgUrl: string = `${environment.imgUrl}/storage/images/`;

  keywords: string = '';
  products: Array<ProductModel> = [];
  categories: Array<CategoryModel> = [];
  product_subscription!: Subscription;
  category_subscription!: Subscription;
  loading: boolean = true;
  lazyLoad!: LazyLoadEvent;
  category_id: number = 0;
  // Pagination #1 start here 
  pagination: PaginationModel = new PaginationModel();
  page_detail: string = "";
  default_page: string = "page=1";
  current_page: string = "page=1";
  totalRecords: number = 0;
  current_user: UserModel = new UserModel();

  selectedProduct: ProductModel[] = [];
  constructor(
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private categoryService: CategoryService
  ) { 
    this.current_user = this.authService.currentUser;
  }

  public firstPage() { this.getAllProducts(this.pagination.first); }
  public prevPage() { this.getAllProducts(this.pagination.prev); }
  public nextPage() { this.getAllProducts(this.pagination.next); }
  public lastPage() { this.getAllProducts(this.pagination.last); }

  ngOnInit(): void {

  }

  print() {
    if(this.selectedProduct.length) {
      var popupWindow : any = window.open('-', 'Print');
      popupWindow.document.write(
        `<!DOCTYPE html>
        <html>
          <head>
          <style type="text/css">
          @media print { 
            body { 
              -webkit-print-color-adjust: exact; 
            }
            table {
              font-family: Arial, Helvetica, sans-serif;
              border-collapse: collapse !important;
              width: 100%;
            }
            td, th {
              border: 1px solid #ddd;
              text-align: left;
              padding: 4px;
              font-size: 12px;
            }
          }</style>
          <link rel="stylesheet" type="text/css" media="all" />
          </head>
          <body>
            <div>
              <label style="text-transform: uppercase;"> LMS <span> ELECTRICAL SUPPLY - PRODUCT PRICING </span> </label>
            </div>
            <br />
            <div>
              <table>
                <thead>
                  <tr>
                    <th>PRODUCT NAME</th>
                    <th>BRAND</th>
                    <th>PRICE</th>
                  </tr>
                </thead>
                <tbody>
        `);

        for(let i = 0; i < this.selectedProduct.length; i++) {
          let product = `${this.selectedProduct[i].product_name} ${this.selectedProduct[i].description}`;
          let brand = this.selectedProduct[i].brands?.brand_name;
          let price = this.selectedProduct[i].selling_price;
          popupWindow.document.write(
            `<tr>
              <td>${product}</td>
              <td>${brand}</td>
              <td style="text-align: right">P ${price}</td>
            </tr>`
          );
        }
        popupWindow.document.write(
              ` </tbody>
              </table>
            </div>
          </body>
        </html>`
        );

      popupWindow.focus();
      popupWindow.print();
      popupWindow.close();
    } else {
      this.messageService.add({
        severity: 'custom',
        detail: 'Please select product to print',
        life: 1500,
        styleClass: 'text-700 bg-red-600 border-y-3 border-white',
        contentStyleClass: 'p-2 text-sm'
      })
    }
  }

  showProductLazyLoad(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.loadCategories();
    this.getAllProducts(this.pagination.first);
  }

  loadCategories() {
    this.categories = [
      {
        id: 0,
        category_name: 'Select Category',
        description: '',
        is_active: false
      }
    ];
    this.category_subscription = this.categoryService.showAllCategories().subscribe({
      next: async (response: any) => {
        const categories = await response.data;

        categories.map((res: any) => {
          this.categories.push(res)
        })
        if(this.categories.length > 0) {
          this.category_id = this.categories[0].id as number;
        }
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

  selectedCategory() {
    this.getAllProducts(this.pagination.first);
  }

  getAllProducts(page: string) {
    this.loading = true;
    this.product_subscription = this.productService.showAllProductsPagination(page, this.keywords, this.category_id).subscribe({
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

        this.products = this.pagination.data;
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
    this.getAllProducts(this.pagination.first);
  }

  addProduct() {
    this.router.navigate(['/application/product-detail/' + 0])
  }

  updateProduct(product: ProductModel) {
    this.router.navigate(['/application/product-detail/' + product.id])
  }

  viewProduct(product: ProductModel) {
    this.dialogRef = this.dialogService.open(ProductInformationComponent, {
      header: 'Product Information',
      styleClass: 'text-sm text-primary',
      width: '55%',
      contentStyle: { "max-height": "600px", "max-width" : "800px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: product,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '75px' 
      }
    });
  }

  deleteProduct(id: number) {
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
        this.productService.deleteProduct(id).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Product Deleted successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });

            // Pagination #5
            let dataLength = this.products.length - 1;
            let current_page = dataLength == 0 ? this.pagination.prev : this.current_page;
            this.current_page = current_page;

            this.getAllProducts(this.current_page);
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

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application';
    this.router.navigateByUrl(returnUrl)
  }

  ngOnDestroy(): void {
    if(this.product_subscription != null) this.product_subscription.unsubscribe();
    if(this.category_subscription != null) this.category_subscription.unsubscribe();
  }

}
