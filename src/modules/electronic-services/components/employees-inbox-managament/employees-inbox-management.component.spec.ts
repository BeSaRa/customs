import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesInboxManagementComponent } from './employees-inbox-management.component';

describe('EmployeesInboxManagementComponent', () => {
  let component: EmployeesInboxManagementComponent;
  let fixture: ComponentFixture<EmployeesInboxManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesInboxManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesInboxManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
