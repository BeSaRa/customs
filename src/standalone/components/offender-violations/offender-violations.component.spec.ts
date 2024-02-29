import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderViolationsComponent } from './offender-violations.component';

describe('OffenderViolationsComponent', () => {
  let component: OffenderViolationsComponent;
  let fixture: ComponentFixture<OffenderViolationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffenderViolationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffenderViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
