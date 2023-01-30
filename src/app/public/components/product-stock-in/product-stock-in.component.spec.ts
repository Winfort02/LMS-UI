import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockInComponent } from './product-stock-in.component';

describe('ProductStockInComponent', () => {
  let component: ProductStockInComponent;
  let fixture: ComponentFixture<ProductStockInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStockInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStockInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
