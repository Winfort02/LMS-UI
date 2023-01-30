import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderPdfComponent } from './sales-order-pdf.component';

describe('SalesOrderPdfComponent', () => {
  let component: SalesOrderPdfComponent;
  let fixture: ComponentFixture<SalesOrderPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
