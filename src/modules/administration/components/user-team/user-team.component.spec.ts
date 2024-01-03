import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTeamComponent } from './user-team.component';

describe('UserTeamComponent', () => {
  let component: UserTeamComponent;
  let fixture: ComponentFixture<UserTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTeamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
