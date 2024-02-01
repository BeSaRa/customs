import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminatePopupComponent } from './terminate-popup.component';

describe('TerminatePopupComponent', () => {
  let component: TerminatePopupComponent;
  let fixture: ComponentFixture<TerminatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminatePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TerminatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
