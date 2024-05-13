import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerDelegationManagementComponent } from '@standalone/components/manager-delegation-management/manager-delegation-management.component';

describe('ManagerDelegationManagementComponent', () => {
  let component: ManagerDelegationManagementComponent;
  let fixture: ComponentFixture<ManagerDelegationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDelegationManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDelegationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
