import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvPredictionComponent } from './pcv-prediction.component';

describe('PcvPredictionComponent', () => {
  let component: PcvPredictionComponent;
  let fixture: ComponentFixture<PcvPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvPredictionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
