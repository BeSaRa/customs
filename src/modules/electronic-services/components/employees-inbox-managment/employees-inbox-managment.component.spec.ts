import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesInboxManagmentComponent } from './employees-inbox-managment.component';

describe('EmployeesInboxManagmentComponent', () => {
  let component: EmployeesInboxManagmentComponent;
  let fixture: ComponentFixture<EmployeesInboxManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesInboxManagmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesInboxManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
