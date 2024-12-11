import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDelegationPopupComponent } from './user-delegation-popup.component';

describe('UserDelegationPopupComponent', () => {
  let component: UserDelegationPopupComponent;
  let fixture: ComponentFixture<UserDelegationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDelegationPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDelegationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
