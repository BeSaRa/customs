import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleAuditPopupComponent } from './job-title-audit-popup.component';

describe('JobTitleAuditPopupComponent', () => {
  let component: JobTitleAuditPopupComponent;
  let fixture: ComponentFixture<JobTitleAuditPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobTitleAuditPopupComponent]
    });
    fixture = TestBed.createComponent(JobTitleAuditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
