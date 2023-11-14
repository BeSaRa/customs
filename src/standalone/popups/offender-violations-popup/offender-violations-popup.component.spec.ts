/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderViolationsPopupComponent } from './offender-violations-popup.component';

describe('OffenderViolationsPopupComponent', () => {
  let component: OffenderViolationsPopupComponent;
  let fixture: ComponentFixture<OffenderViolationsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OffenderViolationsPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffenderViolationsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
