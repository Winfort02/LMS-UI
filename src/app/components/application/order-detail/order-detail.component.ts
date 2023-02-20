import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductModel } from 'src/app/models/product.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductSelectionItemsComponent } from 'src/app/public/components/product-selection-items/product-selection-items.component';
import { OrderItemCartService } from 'src/app/services/application/order/order-item-cart.service';
import { OrderItemCart, OrderItemCartDetail } from 'src/app/models/order-item-cart.model';
import { environment } from 'src/environments/environment';
import { OrderModel } from 'src/app/models/order.model';
import { CustomerModel } from 'src/app/models/customer.model';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { UserModel } from 'src/app/models/user.model';
import { PlaceOrderDetailComponent } from 'src/app/public/components/place-order-detail/place-order-detail.component';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {

  imgUrl: string = `${environment.imgUrl}/storage/images/`;
  current_user: UserModel = new UserModel();
  cart: OrderItemCart = { items:[]}
  customer_subscription!: Subscription;
  dataSource: Array<OrderItemCartDetail> = [];
  product: ProductModel = new ProductModel();
  showDetails: boolean = false;
  order: OrderModel = new OrderModel();
  customer: CustomerModel = new CustomerModel();
  new_customer: CustomerModel = new CustomerModel();
  orderForm: any = FormGroup;
  showOrderItems: boolean = false;
  isComponentShow: boolean = false;

  sales_type: Array<{label: string, value: string, disabled: boolean}> = []

  customers: Array<{label: string, value: number}> = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private orderItemCartService: OrderItemCartService,
    private customerService: CustomerService,
    private activeRoute: ActivatedRoute

  ) { 
    this.current_user = this.authService.currentUser;
    
  }

  ngOnInit(): void {
    
  this.sales_type = [
    {label: 'SELECT', value: '', disabled: false},
    {label: 'CASH', value: 'CASH', disabled: false},
    {label: 'CHARGE', value: 'CHARGE', disabled: this.current_user.user_type == 'User' ? true : false},
    {label: 'DELIVERY', value: 'DELIVERY', disabled: this.current_user.user_type == 'User' ? true : false},
  ];
    this.orderItemCartService.cart.subscribe((_cart) => {
      this.cart = _cart
      this.dataSource = this.cart.items;
    });

    this.loadForm();
  }

  loadForm() {
    this.orderForm = this.formBuilder.group({
      id: [this.order.id],
      customer_id: [this.order.customer_id, [Validators.required]],
      transaction_number: [this.order.transaction_number, [Validators.required]],
      sales_order_number: [this.order.sales_order_number, [Validators.required]],
      sales_type: [this.order.sales_type, [Validators.required]],
    });

    this.orderForm.controls.transaction_number.disable();

    this.loadCustomer();
  }

  loadCustomer() {
    this.customers = [
      {label : 'SELECT', value: 0},
    ];
    this.customer_subscription = this.customerService.showAllCustomer().subscribe({
      next: async (response: any) => {
        const customer = await response.data;
        customer.map((res: any) => {
          this.customers.push({
            label: res.customer_name,
            value: res.id
          })
        })
        if(this.customers.length > 0) {
          await this.orderForm.patchValue({
            customer_id: this.customers[0].value
          });
        }
        this.isComponentShow = true;
         // this.showProductLazyLoad(this.lazyLoad);
      },
      error: (error) => {
        this.isComponentShow = true;
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

  loadCustomerDetail(customer_id: number) {
    if(customer_id !== 0) {
      this.customerService.getCustomerById(customer_id).subscribe({
        next: async (response: any) => {
          const customer = await response.data;
          this.customer = customer;
          this.showOrderItems = true;
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
      });
    } else {
      this.showOrderItems = false;
      return
    }
  }

  productQuery() {
    this.dialogRef = this.dialogService.open(ProductSelectionItemsComponent, {
      header: 'Product Selection Box',
      styleClass: 'text-sm text-primary',
      width: '480px',
      height: '50px',
      contentStyle: {"overflow-y": "visible", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: 1,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '150px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {
      if(response) {
        if(response.product) {
          this.product = response.product;
          this.showDetails = true;
        }
      } else {
        return
      }
    });
  }

  getTotal(items: Array<OrderItemCartDetail>): number {
    return this.orderItemCartService.getTotal(items);
  }

  getTotalDiscount(items: Array<OrderItemCartDetail>): number {
    return this.orderItemCartService.getTotalDiscount(items);
  }

  onClearCart(): void {
    this.orderItemCartService.onClearCart()
  }

  removeItemFromCart(item: OrderItemCartDetail) : void {
    this.orderItemCartService.removeFromCart(item);
  } 

  onAddQty(item: OrderItemCartDetail): void {
    if(item.quantity < item.available_qty) {
      this.orderItemCartService.addToCart(item)
    } else {
      this.messageService.add({
        severity: 'custom',
        detail: `Product ${item.product_name} has ${item.available_qty} quantity available only`,
        life: 2000,
        closable: false,
        icon: 'pi pi-check-circle text-lg mt-2 text-white',
        styleClass: 'text-700 bg-red-600 border-y-3 border-white',
        contentStyleClass: 'p-2 text-sm'
      });
      return
    }
    
  }

  onRemoveQty(item: OrderItemCartDetail): void {
    this.orderItemCartService.removeQty(item);
  }

  selectedSupplier(event: any) {
    const id = event.value;
    this.loadCustomerDetail(id);
  }

  proceed() {
    if(this.orderForm.valid) {
      if(this.customer.id as number > 0) {
        if(this.orderForm.valid) { 
          this.order = this.orderForm.value;
          const order_items = this.orderItemCartService.getCart();
          this.order.items = order_items.items.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            sub_total: item.price * item.quantity
          }));
          this.order.user_id = this.current_user.id as number;
          this.order.total_amount = this.orderItemCartService.getTotal(order_items.items);
          if(this.order.items.length) {
            this.dialogRef = this.dialogService.open(PlaceOrderDetailComponent, {
              header: 'CHECK OUT',
              styleClass: 'text-sm text-primary',
              width: '480px',
              contentStyle: {"max-height":"600px", "overflow-y": "visible", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
              baseZIndex: 10000,
              data: this.order,
              style: { 
                'align-self': 'flex-start', 
                'margin-top': '150px' 
              }
            });
  
            this.dialogRef.onClose.subscribe((data: any) => {
              if(data) {
                if(data.success) {
                  let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application/orders';
                  this.router.navigateByUrl(returnUrl)
                }
              } else {
                return
              }
            });
          } else {
            this.messageService.add({
              severity: 'custom',
              detail: 'Please add a product to process the order',
              life: 2000,
              closable: false,
              icon: 'pi-exclamation-circle text-lg mt-2 text-white',
              styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
              contentStyleClass: 'p-2 text-sm'
            });
            return
          }
        }
      }
    }
  }

  close() {
    let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/application/orders';
    this.router.navigateByUrl(returnUrl)
  }

  addCustomer() {
    this.dialogRef = this.dialogService.open(CustomerDetailComponent, {
      header: 'Category Detail',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: this.new_customer,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '75px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {
      if(response.success) {
        if(response.code === 201) {
          this.customer = response.data;
          this.customers.push({
            label: this.customer.customer_name,
            value: this.customer.id as number
          })
          this.orderForm.patchValue({
            customer_id: response.data.id
          });
          this.loadCustomerDetail(this.customer.id as number);
          this.messageService.add({
            severity: 'custom',
            detail: 'New Customer Added Successfully',
            life: 2000,
            closable: false,
            icon: 'pi pi-check-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          });
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
      }
        
    });
  }

  ngOnDestroy(): void {
    if(this.customer_subscription != null) this.customer_subscription.unsubscribe();
  }

}
