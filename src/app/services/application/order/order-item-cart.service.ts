import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderItemCart, OrderItemCartDetail } from 'src/app/models/order-item-cart.model';

@Injectable({
  providedIn: 'root'
})
export class OrderItemCartService {

  cart = new BehaviorSubject<OrderItemCart>({ items: this.getCartFormLocalStorage() });

  constructor() { }

  addToCart(item: OrderItemCartDetail): void {
    const items = [...this.cart.value.items];
    const cartItem = items.find((_item) => _item.product_id === item.product_id);
    if(cartItem) {
      cartItem.quantity += 1;
    } else {
      items.push(item)
    }
    this.cart.next({ items })
    this.setCartToLocalStorage();
  }

  getTotal(items: Array<OrderItemCartDetail>): number {
    return items.map((item) => (item.price * item.quantity) - item.discount).reduce((prev, curr) => prev + curr, 0);
  }

  getTotalQuantiy(items: Array<OrderItemCartDetail>): number {
    return items.map((item) => item.quantity).reduce((prev, curr) => prev + curr, 0);
  }

  getTotalDiscount(items: Array<OrderItemCartDetail>): number {
    return items.map((item) => item.discount).reduce((prev, curr) => prev + curr, 0);
  }

  onClearCart(): void {
    this.cart.next({ items: []});
    this.setCartToLocalStorage();
  }

  removeFromCart(item: OrderItemCartDetail, update = true): Array<OrderItemCartDetail> {
    const filteredItems = this.cart.value.items.filter((_item) => _item.product_id !== item.product_id);
    if(update) {
      this.cart.next({ items: filteredItems });
      this.setCartToLocalStorage();
    }
    
    return filteredItems;
  }

  removeQty(item: OrderItemCartDetail): void {

    let itemTobeRemove: OrderItemCartDetail | undefined;

    let filteredItems = this.cart.value.items.map((_item) => {
      if(_item.product_id === item.product_id) {
        _item.quantity--;
        if (_item.quantity === 0) {
          itemTobeRemove = _item;
        }
      }

      return _item;
    });

    if(itemTobeRemove) {
      filteredItems = this.removeFromCart(itemTobeRemove, false);
    }
    this.cart.next({ items: filteredItems});
    this.setCartToLocalStorage();
  }

  private setCartToLocalStorage(): void {
    const cartJson = JSON.stringify(this.cart.value.items);
    localStorage.setItem('Cart', cartJson);
    this.cart.next({ items: this.cart.value.items })
  }

  private getCartFormLocalStorage(): Array<OrderItemCartDetail> {
    const cartJson = localStorage.getItem('Cart')
    return cartJson ? JSON.parse(cartJson): [] ;
  }


  getCart(): OrderItemCart {
    return this.cart.value;
  }
}
