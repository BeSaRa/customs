import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAttachmentsComponent } from './case-attachments.component';

describe('CaseAttachmentsComponent', () => {
  let component: CaseAttachmentsComponent;
  let fixture: ComponentFixture<CaseAttachmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseAttachmentsComponent],
    });
    fixture = TestBed.createComponent(CaseAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
