import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationComponent } from './investigation.component';

describe('InvestigationComponent', () => {
  let component: InvestigationComponent;
  let fixture: ComponentFixture<InvestigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigationComponent],
    });
    fixture = TestBed.createComponent(InvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
