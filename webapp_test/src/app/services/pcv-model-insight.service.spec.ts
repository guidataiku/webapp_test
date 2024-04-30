import { TestBed } from '@angular/core/testing';

import { PcvModelInsightService } from './pcv-model-insight.service';

describe('PcvModelInsightService', () => {
  let service: PcvModelInsightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PcvModelInsightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
