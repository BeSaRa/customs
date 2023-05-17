import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationTypePopupComponent } from './violation-type-popup.component';

describe('ViolationTypePopupComponent', () => {
  let component: ViolationTypePopupComponent;
  let fixture: ComponentFixture<ViolationTypePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolationTypePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationTypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
