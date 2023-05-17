import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserPopupComponent } from './internal-user-popup.component';

describe('InternalUserPopupComponent', () => {
  let component: InternalUserPopupComponent;
  let fixture: ComponentFixture<InternalUserPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalUserPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
