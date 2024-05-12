import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDelegationComponent } from './manager-delegation.component';

describe('ManagerDelegationComponent', () => {
  let component: ManagerDelegationComponent;
  let fixture: ComponentFixture<ManagerDelegationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerDelegationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
