import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionDateRangeComponent } from './selection-date-range.component';

describe('SelectionDateRangeComponent', () => {
  let component: SelectionDateRangeComponent;
  let fixture: ComponentFixture<SelectionDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionDateRangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
