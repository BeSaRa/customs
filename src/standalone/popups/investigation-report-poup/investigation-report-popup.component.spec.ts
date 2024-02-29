import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationReportPopupComponent } from './investigation-report-popup.component';

describe('InvestigationReportPoupComponent', () => {
  let component: InvestigationReportPopupComponent;
  let fixture: ComponentFixture<InvestigationReportPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigationReportPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigationReportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
