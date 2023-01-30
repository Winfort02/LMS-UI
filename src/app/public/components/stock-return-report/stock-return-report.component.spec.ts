import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReturnReportComponent } from './stock-return-report.component';

describe('StockReturnReportComponent', () => {
  let component: StockReturnReportComponent;
  let fixture: ComponentFixture<StockReturnReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockReturnReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReturnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
