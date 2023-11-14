/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MakePenaltyDecisionPopupComponent } from './make-penalty-decision-popup.component';

describe('MakePenaltyDecisionPopupComponent', () => {
  let component: MakePenaltyDecisionPopupComponent;
  let fixture: ComponentFixture<MakePenaltyDecisionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePenaltyDecisionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePenaltyDecisionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
