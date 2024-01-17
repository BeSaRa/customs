import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuspendEmployeePopupComponent } from './susbend-employee-popup.component';

describe('SuspendEmployeePopupComponent', () => {
  let component: SuspendEmployeePopupComponent;
  let fixture: ComponentFixture<SuspendEmployeePopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SuspendEmployeePopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspendEmployeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
