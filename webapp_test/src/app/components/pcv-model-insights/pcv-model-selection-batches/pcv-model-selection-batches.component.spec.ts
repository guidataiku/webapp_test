import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvModelSelectionBatchesComponent } from './pcv-model-selection-batches.component';

describe('PcvModelSelectionBatchesComponent', () => {
  let component: PcvModelSelectionBatchesComponent;
  let fixture: ComponentFixture<PcvModelSelectionBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvModelSelectionBatchesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvModelSelectionBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
