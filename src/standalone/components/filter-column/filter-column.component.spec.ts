import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterColumnComponent } from './filter-column.component';

describe('FilterColumnComponent', () => {
  let component: FilterColumnComponent;
  let fixture: ComponentFixture<FilterColumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterColumnComponent],
    });
    fixture = TestBed.createComponent(FilterColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
