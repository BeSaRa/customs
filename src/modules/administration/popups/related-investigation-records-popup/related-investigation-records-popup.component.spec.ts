import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedInvestigationRecordsPopupComponent } from './related-investigation-records-popup.component';

describe('RelatedInvestigationRecordsPopupComponent', () => {
  let component: RelatedInvestigationRecordsPopupComponent;
  let fixture: ComponentFixture<RelatedInvestigationRecordsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedInvestigationRecordsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedInvestigationRecordsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
