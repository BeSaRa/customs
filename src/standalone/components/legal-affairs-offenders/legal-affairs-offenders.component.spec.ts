import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalAffairsOffendersComponent } from './legal-affairs-offenders.component';

describe('LegalAffairsOffendersComponent', () => {
  let component: LegalAffairsOffendersComponent;
  let fixture: ComponentFixture<LegalAffairsOffendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalAffairsOffendersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalAffairsOffendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
