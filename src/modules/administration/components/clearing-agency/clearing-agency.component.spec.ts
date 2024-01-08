import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearingAgencyComponent } from './clearing-agency.component';

describe('ClearingAgencyComponent', () => {
  let component: ClearingAgencyComponent;
  let fixture: ComponentFixture<ClearingAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClearingAgencyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearingAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
