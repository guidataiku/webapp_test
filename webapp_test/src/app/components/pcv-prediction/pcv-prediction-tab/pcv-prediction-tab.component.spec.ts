import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvPredictionTabComponent } from './pcv-prediction-tab.component';

describe('PcvPredictionTabComponent', () => {
  let component: PcvPredictionTabComponent;
  let fixture: ComponentFixture<PcvPredictionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvPredictionTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvPredictionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
