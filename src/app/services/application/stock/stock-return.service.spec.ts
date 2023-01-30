import { TestBed } from '@angular/core/testing';

import { StockReturnService } from './stock-return.service';

describe('StockReturnService', () => {
  let service: StockReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
