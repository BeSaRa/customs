import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinaryCommitteeMeetingsComponent } from './disciplinary-committee-meetings.component';

describe('DisciplinaryCommitteeMeetingsComponent', () => {
  let component: DisciplinaryCommitteeMeetingsComponent;
  let fixture: ComponentFixture<DisciplinaryCommitteeMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinaryCommitteeMeetingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisciplinaryCommitteeMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
