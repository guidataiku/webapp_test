import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterDashboardFormComponent } from './parameter-dashboard-form.component';

describe('ParameterDashboardFormComponent', () => {
  let component: ParameterDashboardFormComponent;
  let fixture: ComponentFixture<ParameterDashboardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterDashboardFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParameterDashboardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
