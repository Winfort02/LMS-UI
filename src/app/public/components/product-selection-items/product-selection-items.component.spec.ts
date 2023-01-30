import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSelectionItemsComponent } from './product-selection-items.component';

describe('ProductSelectionItemsComponent', () => {
  let component: ProductSelectionItemsComponent;
  let fixture: ComponentFixture<ProductSelectionItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSelectionItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSelectionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
