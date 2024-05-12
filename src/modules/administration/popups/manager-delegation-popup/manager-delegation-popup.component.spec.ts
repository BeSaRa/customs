import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDelegationPopupComponent } from './manager-delegation-popup.component';

describe('ManagerDelegationPopupComponent', () => {
  let component: ManagerDelegationPopupComponent;
  let fixture: ComponentFixture<ManagerDelegationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerDelegationPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDelegationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
