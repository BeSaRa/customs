import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalRulePopupComponent } from './legal-rule-popup.component';

describe('LegalRulePopupComponent', () => {
  let component: LegalRulePopupComponent;
  let fixture: ComponentFixture<LegalRulePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalRulePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalRulePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
