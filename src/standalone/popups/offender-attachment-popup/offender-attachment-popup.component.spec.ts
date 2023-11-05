/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderAttachmentPopupComponent } from './offender-attachment-popup.component';

describe('OffenderAttachmentPopupComponent', () => {
  let component: OffenderAttachmentPopupComponent;
  let fixture: ComponentFixture<OffenderAttachmentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OffenderAttachmentPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffenderAttachmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
