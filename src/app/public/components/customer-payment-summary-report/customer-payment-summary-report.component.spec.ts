import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentSummaryReportComponent } from './customer-payment-summary-report.component';

describe('CustomerPaymentSummaryReportComponent', () => {
  let component: CustomerPaymentSummaryReportComponent;
  let fixture: ComponentFixture<CustomerPaymentSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPaymentSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
