import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionRolePopupComponent } from './permission-role-popup.component';

describe('PermissionRolePopupComponent', () => {
  let component: PermissionRolePopupComponent;
  let fixture: ComponentFixture<PermissionRolePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermissionRolePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionRolePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
