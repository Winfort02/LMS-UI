import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReturnDetailComponent } from './stock-return-detail.component';

describe('StockReturnDetailComponent', () => {
  let component: StockReturnDetailComponent;
  let fixture: ComponentFixture<StockReturnDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockReturnDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReturnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
