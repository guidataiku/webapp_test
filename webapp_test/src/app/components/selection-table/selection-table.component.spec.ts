import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTableComponent } from './selection-table.component';

describe('SelectionTableComponent', () => {
  let component: SelectionTableComponent;
  let fixture: ComponentFixture<SelectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
