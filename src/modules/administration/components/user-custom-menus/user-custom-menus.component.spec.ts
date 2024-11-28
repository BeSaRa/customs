import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCustomMenusComponent } from './user-custom-menus.component';

describe('UserCustomMenusComponent', () => {
  let component: UserCustomMenusComponent;
  let fixture: ComponentFixture<UserCustomMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCustomMenusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCustomMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
