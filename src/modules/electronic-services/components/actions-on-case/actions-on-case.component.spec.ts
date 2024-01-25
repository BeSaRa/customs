import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsOnCaseComponent } from './actions-on-case.component';

describe('ActionsOnCaseComponent', () => {
  let component: ActionsOnCaseComponent;
  let fixture: ComponentFixture<ActionsOnCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsOnCaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsOnCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
