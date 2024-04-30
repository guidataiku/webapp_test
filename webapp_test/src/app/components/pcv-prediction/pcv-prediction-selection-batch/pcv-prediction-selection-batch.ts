import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvPredictionSelectionBatchComponent } from './pcv-prediction-selection-batch.component';

describe('PcvPredictionSelectionBatchComponent', () => {
  let component: PcvPredictionSelectionBatchComponent;
  let fixture: ComponentFixture<PcvPredictionSelectionBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvPredictionSelectionBatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvPredictionSelectionBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
