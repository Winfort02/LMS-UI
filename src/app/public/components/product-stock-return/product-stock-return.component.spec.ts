import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockReturnComponent } from './product-stock-return.component';

describe('ProductStockReturnComponent', () => {
  let component: ProductStockReturnComponent;
  let fixture: ComponentFixture<ProductStockReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStockReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStockReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
