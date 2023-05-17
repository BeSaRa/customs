import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationClassificationPopupComponent } from './violation-classification-popup.component';

describe('ViolationClassificationPopupComponent', () => {
  let component: ViolationClassificationPopupComponent;
  let fixture: ComponentFixture<ViolationClassificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolationClassificationPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationClassificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
