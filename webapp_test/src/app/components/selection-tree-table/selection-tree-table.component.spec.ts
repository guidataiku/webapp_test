import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTreeTableComponent } from './selection-tree-table.component';

describe('SelectionTreeTableComponent', () => {
  let component: SelectionTreeTableComponent;
  let fixture: ComponentFixture<SelectionTreeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionTreeTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionTreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
