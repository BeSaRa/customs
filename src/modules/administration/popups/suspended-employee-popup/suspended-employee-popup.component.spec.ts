import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendedEmployeePopupComponent } from './suspended-employee-popup.component';

describe('SuspendedEmployeePopupComponent', () => {
  let component: SuspendedEmployeePopupComponent;
  let fixture: ComponentFixture<SuspendedEmployeePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuspendedEmployeePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuspendedEmployeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
