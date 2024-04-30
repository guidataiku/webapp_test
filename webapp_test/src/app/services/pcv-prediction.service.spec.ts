import { TestBed } from '@angular/core/testing';

import { PcvPredictionService } from './pcv-prediction.service';

describe('PcvPredictionService', () => {
  let service: PcvPredictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PcvPredictionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
