import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendedEmployeeComponent } from './suspended-employee.component';

describe('SuspendedEmployeeComponent', () => {
  let component: SuspendedEmployeeComponent;
  let fixture: ComponentFixture<SuspendedEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuspendedEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuspendedEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
