import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignTaskPopupComponent } from './reassign-task-popup.component';

describe('ReassignTaskPopupComponent', () => {
  let component: ReassignTaskPopupComponent;
  let fixture: ComponentFixture<ReassignTaskPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReassignTaskPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReassignTaskPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
