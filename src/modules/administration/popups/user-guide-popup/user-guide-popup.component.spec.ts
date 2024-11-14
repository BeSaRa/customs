import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGuidePopupComponent } from './user-guide-popup.component';

describe('UserGuidePopupComponent', () => {
  let component: UserGuidePopupComponent;
  let fixture: ComponentFixture<UserGuidePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserGuidePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserGuidePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
