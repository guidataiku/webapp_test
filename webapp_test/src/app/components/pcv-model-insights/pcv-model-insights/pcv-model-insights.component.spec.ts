import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvModelInsightsComponent } from './pcv-model-insights.component';

describe('PcvModelInsightsComponent', () => {
  let component: PcvModelInsightsComponent;
  let fixture: ComponentFixture<PcvModelInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvModelInsightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvModelInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
