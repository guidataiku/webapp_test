import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvModelTabComponent } from './pcv-model-tab.component';

describe('PcvModelTabComponent', () => {
  let component: PcvModelTabComponent;
  let fixture: ComponentFixture<PcvModelTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcvModelTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcvModelTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
