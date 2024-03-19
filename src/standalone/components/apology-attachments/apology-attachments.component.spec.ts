import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApologyAttachmentsComponent } from './apology-attachments.component';

describe('CaseAttachmentsComponent', () => {
  let component: ApologyAttachmentsComponent;
  let fixture: ComponentFixture<ApologyAttachmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApologyAttachmentsComponent],
    });
    fixture = TestBed.createComponent(ApologyAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
