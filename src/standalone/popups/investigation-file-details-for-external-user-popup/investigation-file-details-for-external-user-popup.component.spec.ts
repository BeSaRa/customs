import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationFileDetailsForExternalUserPopupComponent } from './investigation-file-details-for-external-user-popup.component';

describe('InvestigationFileDetailsForExternalUserPopupComponent', () => {
  let component: InvestigationFileDetailsForExternalUserPopupComponent;
  let fixture: ComponentFixture<InvestigationFileDetailsForExternalUserPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigationFileDetailsForExternalUserPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      InvestigationFileDetailsForExternalUserPopupComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
