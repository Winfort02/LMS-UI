import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderItemSummaryReportComponent } from './sales-order-item-summary-report.component';

describe('SalesOrderItemSummaryReportComponent', () => {
  let component: SalesOrderItemSummaryReportComponent;
  let fixture: ComponentFixture<SalesOrderItemSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderItemSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderItemSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
