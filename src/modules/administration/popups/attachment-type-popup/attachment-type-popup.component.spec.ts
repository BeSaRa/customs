import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentTypePopupComponent } from './attachment-type-popup.component';

describe('AttachmentTypePopupComponent', () => {
  let component: AttachmentTypePopupComponent;
  let fixture: ComponentFixture<AttachmentTypePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttachmentTypePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentTypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
