import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttachmentPopupComponent } from './view-attachment-popup.component';

describe('ViewAttachmentPopupComponent', () => {
  let component: ViewAttachmentPopupComponent;
  let fixture: ComponentFixture<ViewAttachmentPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewAttachmentPopupComponent],
    });
    fixture = TestBed.createComponent(ViewAttachmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
