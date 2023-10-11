import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserOUPopupComponent } from './internal-user-ou-popup.component';

describe('InternalUserOUPopupComponent', () => {
  let component: InternalUserOUPopupComponent;
  let fixture: ComponentFixture<InternalUserOUPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalUserOUPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalUserOUPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
