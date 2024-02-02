import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationPopupComponent } from './integration-popup.component';

describe('IntegrationPopupComponent', () => {
  let component: IntegrationPopupComponent;
  let fixture: ComponentFixture<IntegrationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
