import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplatePopupComponent } from './email-template-popup.component';

describe('EmailTemplatePopupComponent', () => {
  let component: EmailTemplatePopupComponent;
  let fixture: ComponentFixture<EmailTemplatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplatePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
