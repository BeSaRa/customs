import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalAffairsProceduresComponent } from './legal-affairs-procedures.component';

describe('LegalAffairsProceduresComponent', () => {
  let component: LegalAffairsProceduresComponent;
  let fixture: ComponentFixture<LegalAffairsProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalAffairsProceduresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalAffairsProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
