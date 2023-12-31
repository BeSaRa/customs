import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTeamPopupComponent } from './user-team-popup.component';

describe('UserTeamPopupComponent', () => {
  let component: UserTeamPopupComponent;
  let fixture: ComponentFixture<UserTeamPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTeamPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTeamPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
