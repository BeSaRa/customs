import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemIconComponent } from './menu-item-icon.component';

describe('MenuItemIconComponent', () => {
  let component: MenuItemIconComponent;
  let fixture: ComponentFixture<MenuItemIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuItemIconComponent],
    });
    fixture = TestBed.createComponent(MenuItemIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
