import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearingAgentComponent } from './clearing-agent.component';

describe('ClearingAgentComponent', () => {
  let component: ClearingAgentComponent;
  let fixture: ComponentFixture<ClearingAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClearingAgentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearingAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
