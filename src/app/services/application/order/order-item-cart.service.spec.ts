import { TestBed } from '@angular/core/testing';

import { OrderItemCartService } from './order-item-cart.service';

describe('OrderItemCartService', () => {
  let service: OrderItemCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderItemCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
