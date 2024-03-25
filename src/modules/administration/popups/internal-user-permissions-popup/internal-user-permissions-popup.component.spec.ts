import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserPermissionsPopupComponent } from './internal-user-permissions-popup.component';

describe('InternalUserPermissionsPopupComponent', () => {
  let component: InternalUserPermissionsPopupComponent;
  let fixture: ComponentFixture<InternalUserPermissionsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalUserPermissionsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalUserPermissionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
