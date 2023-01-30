import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrderDetailComponent } from './update-order-detail.component';

describe('UpdateOrderDetailComponent', () => {
  let component: UpdateOrderDetailComponent;
  let fixture: ComponentFixture<UpdateOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOrderDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
