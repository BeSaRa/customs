import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRequestPopupComponent } from './call-request-popup.component';

describe('CallRequestPopupComponent', () => {
  let component: CallRequestPopupComponent;
  let fixture: ComponentFixture<CallRequestPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallRequestPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CallRequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
