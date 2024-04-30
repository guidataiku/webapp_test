import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvParameterChartComponent } from './pcv-parameter-chart.component';

describe('PcvParameterChartComponent', () => {
  let component: PcvParameterChartComponent;
  let fixture: ComponentFixture<PcvParameterChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvParameterChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvParameterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
