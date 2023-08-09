import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationPenaltyComponent } from './violation-penalty.component';

describe('ViolationPenaltyComponent', () => {
  let component: ViolationPenaltyComponent;
  let fixture: ComponentFixture<ViolationPenaltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolationPenaltyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
