import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockInReportComponent } from './product-stock-in-report.component';

describe('ProductStockInReportComponent', () => {
  let component: ProductStockInReportComponent;
  let fixture: ComponentFixture<ProductStockInReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStockInReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStockInReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
