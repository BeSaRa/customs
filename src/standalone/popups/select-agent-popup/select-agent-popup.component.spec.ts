import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAgentPopupComponent } from './select-agent-popup.component';

describe('SelectAgentPopupComponent', () => {
  let component: SelectAgentPopupComponent;
  let fixture: ComponentFixture<SelectAgentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAgentPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectAgentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
