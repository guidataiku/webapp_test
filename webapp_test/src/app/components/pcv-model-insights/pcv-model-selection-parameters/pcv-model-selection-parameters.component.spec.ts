import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PcvModelSelectionParametersComponent } from './pcv-model-selection-parameters.component';

describe('PcvModelSelectionParametersComponent', () => {
  let component: PcvModelSelectionParametersComponent;
  let fixture: ComponentFixture<PcvModelSelectionParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvModelSelectionParametersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvModelSelectionParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
