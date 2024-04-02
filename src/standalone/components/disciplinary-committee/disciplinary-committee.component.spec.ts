import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinaryCommitteeComponent } from './disciplinary-committee.component';

describe('DisciplinaryCommitteeMeetingsComponent', () => {
  let component: DisciplinaryCommitteeComponent;
  let fixture: ComponentFixture<DisciplinaryCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinaryCommitteeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisciplinaryCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
