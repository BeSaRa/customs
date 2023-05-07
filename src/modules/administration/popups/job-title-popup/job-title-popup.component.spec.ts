import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitlePopupComponent } from './job-title-popup.component';

describe('JobTitlePopupComponent', () => {
  let component: JobTitlePopupComponent;
  let fixture: ComponentFixture<JobTitlePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobTitlePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobTitlePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
