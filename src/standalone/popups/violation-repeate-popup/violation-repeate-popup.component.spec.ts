/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationRepeatePopupComponent } from './violation-repeate-popup.component';

describe('ViolationRepeatePopupComponent', () => {
  let component: ViolationRepeatePopupComponent;
  let fixture: ComponentFixture<ViolationRepeatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViolationRepeatePopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationRepeatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
