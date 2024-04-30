import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvPredictionChartComponent } from './pcv-prediction-chart.component';

describe('PcvPredictionChartComponent', () => {
  let component: PcvPredictionChartComponent;
  let fixture: ComponentFixture<PcvPredictionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvPredictionChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvPredictionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
