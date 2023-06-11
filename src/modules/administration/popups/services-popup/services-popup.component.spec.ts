import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPopupComponent } from './services-popup.component';

describe('ServicesPopupComponent', () => {
  let component: ServicesPopupComponent;
  let fixture: ComponentFixture<ServicesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
