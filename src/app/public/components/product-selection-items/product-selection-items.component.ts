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
import { SupplierService } from 'src/app/services/application/supplier/supplier.service';
import { SupplierModel } from 'src/app/models/supplier.model';
import { OrderItemCartService } from 'src/app/services/application/order/order-item-cart.service';
import { OrderItemCart } from 'src/app/models/order-item-cart.model';

@Component({
  selector: 'app-product-selection-items',
  templateUrl: './product-selection-items.component.html',
  styleUrls: ['./product-selection-items.component.scss']
})
export class ProductSelectionItemsComponent implements OnInit {
  
  products: Array<ProductModel> | any = [];
  product_subscription!: Subscription;
  supplier_subscriotion!: Subscription;
  product: any;
  product_item: any = {
    id: 0,
    product_name: '',
    product_image: '',
    product_price: 0,
    product_on_hand: 0
  };
  loading: boolean = true;
  lazyLoad!: LazyLoadEvent;
  product_id: number = 0;
  quantity: number = 0;
  discount: number = 0;
  price: number = 0;
  sub_total: number = 0;

  cart: OrderItemCart = { items:[]}

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private supplierService: SupplierService,
    private orderItemService: OrderItemCartService
  ) { 
    this.orderItemService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
  }
  

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.products = [{
      product_name: 'Select Product', id: 0
    }];
    this.product_subscription = this.productService.showAllProducts().subscribe({
      next: async (response: any) => {
        const products = await response.data;

        products.filter((product: any) => {
          const item = product.quantity !== 0
          return item;
        }).map((item: any) => {
          this.products.push({
            product_name: `${item.product_name} ${item.description}`,
            id: item.id,
            image: item.image,
            selling_price: item.selling_price,
            quantity: item.quantity,
            brand: item.brands.brand_name
          })
        })
        if(this.products.length > 0) {
          this.product_id = this.products[0].id as number;
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

  calculate() {
    this.sub_total = parseInt(this.product_item.product_price) * this.quantity;
  }

  selectedProduct(event: any) {
    this.quantity = 0;
    this.sub_total = 0;
    const product_id = event.value;
     this.product = this.products.filter((item: any) => { let items = item.id === product_id; return items }).map((data: any) => {
      this.price = data.selling_price;
      this.product_item = {
        id: data.id,
        product_name: data.product_name,
        brand: data.brand,
        product_image: data.image,
        product_price: data.selling_price,
        product_on_hand: data.quantity
      }
    });
  }


  selectProduct() {
    if(this.product_id == 0) {
      this.messageService.add({
        severity: 'custom',
        detail: `Please select a product`,
        life: 1500,
        styleClass: 'text-700 bg-red-700 border-y-3 border-white text-white',
        contentStyleClass: 'p-2 text-sm'
      });
      return
    }
    if(this.cart.items.length > 0) {
      const current_product = this.cart.items.find((d: any) => d.product_id === this.product_item.id);
      if(current_product) {
        if(current_product.product_id !== this.product_item.id) {
          if(this.quantity > current_product.available_qty) {
            this.messageService.add({
              severity: 'custom',
              detail: `Product ${this.product_item.product_name} has ${current_product.available_qty} quantity on hand`,
              life: 1500,
              styleClass: 'text-700 bg-red-600 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            return
          }
          this.orderItemService.addToCart({
            product_image: this.product_item.product_image,
            product_name: this.product_item.product_name,
            brand: this.product_item.brand,
            price: this.product_item.product_price,
            quantity: this.quantity,
            discount: this.discount,
            product_id: this.product_item.id,
            available_qty: this.product_item.product_on_hand
          });
          this.messageService.add({
            severity: 'custom',
            detail: `Product ${this.product_item.product_name} add to list successfully`,
            life: 1500,
            styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.discount = 0;
          this.quantity = 0;
          return
        } else {
          this.messageService.add({
            severity: 'custom',
            detail: `Product ${this.product_item.product_name} has already addded to the list`,
            life: 1500,
            styleClass: 'text-700 bg-red-600 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.discount = 0;
          this.quantity = 0;
          return
        }
      } else {
        this.orderItemService.addToCart({
          product_image: this.product_item.product_image,
          product_name: this.product_item.product_name,
          brand: this.product_item.brand,
          price: this.product_item.product_price,
          quantity: this.quantity,
          discount: this.discount,
          product_id: this.product_item.id,
          available_qty: this.product_item.product_on_hand
        });
        this.messageService.add({
          severity: 'custom',
          detail: `Product ${this.product_item.product_name} add to list successfully`,
          life: 1500,
          styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.discount = 0;
          this.quantity = 0;
        return
      }
    } else {
      if(this.quantity > this.product_item.product_on_hand) {
        this.messageService.add({
          severity: 'custom',
          detail: `Product ${this.product_item.product_name} has ${this.product_item.product_on_hand} quantity on hand`,
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        return
      }
      this.orderItemService.addToCart({
        product_image: this.product_item.product_image,
        product_name: this.product_item.product_name,
        brand: this.product_item.brand,
        price: this.product_item.product_price,
        quantity: this.quantity,
        discount: this.discount,
        product_id: this.product_item.id,
        available_qty: this.product_item.product_on_hand
      });
      this.messageService.add({
        severity: 'custom',
        detail: `Product ${this.product_item.product_name} add to list successfully`,
        life: 1500,
        styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
        contentStyleClass: 'p-2 text-sm'
      });
      this.discount = 0;
      this.quantity = 0;
      return
    }
  }


}
