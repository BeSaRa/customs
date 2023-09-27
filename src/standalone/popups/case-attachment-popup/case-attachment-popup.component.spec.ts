import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAttachmentPopupComponent } from './case-attachment-popup.component';

describe('CaseAttachmentPopupComponent', () => {
  let component: CaseAttachmentPopupComponent;
  let fixture: ComponentFixture<CaseAttachmentPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseAttachmentPopupComponent],
    });
    fixture = TestBed.createComponent(CaseAttachmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
