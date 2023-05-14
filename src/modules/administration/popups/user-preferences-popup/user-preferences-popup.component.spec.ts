import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesPopupComponent } from './user-preferences-popup.component';

describe('UserPreferencesPopupComponent', () => {
  let component: UserPreferencesPopupComponent;
  let fixture: ComponentFixture<UserPreferencesPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPreferencesPopupComponent]
    });
    fixture = TestBed.createComponent(UserPreferencesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
