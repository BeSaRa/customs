import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationDraftsComponent } from './investigation-drafts.component';

describe('InvestigationDraftsComponent', () => {
  let component: InvestigationDraftsComponent;
  let fixture: ComponentFixture<InvestigationDraftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigationDraftsComponent],
    });
    fixture = TestBed.createComponent(InvestigationDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
