import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceOrderDetailComponent } from './place-order-detail.component';

describe('PlaceOrderDetailComponent', () => {
  let component: PlaceOrderDetailComponent;
  let fixture: ComponentFixture<PlaceOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceOrderDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
