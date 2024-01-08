import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearingAgentPopupComponent } from './clearing-agent-popup.component';

describe('ClearingAgentPopupComponent', () => {
  let component: ClearingAgentPopupComponent;
  let fixture: ComponentFixture<ClearingAgentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClearingAgentPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearingAgentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
