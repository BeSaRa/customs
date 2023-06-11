import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStepsPopupComponent } from './service-steps-popup.component';

describe('ServiceStepsPopupComponent', () => {
  let component: ServiceStepsPopupComponent;
  let fixture: ComponentFixture<ServiceStepsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceStepsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceStepsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
