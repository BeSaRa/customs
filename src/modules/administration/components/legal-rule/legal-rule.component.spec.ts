import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalRuleComponent } from './legal-rule.component';

describe('LegalRuleComponent', () => {
  let component: LegalRuleComponent;
  let fixture: ComponentFixture<LegalRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalRuleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
