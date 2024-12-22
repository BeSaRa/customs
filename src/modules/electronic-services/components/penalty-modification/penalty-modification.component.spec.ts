import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyModificationComponent } from './penalty-modification.component';

describe('PenaltyModificationComponent', () => {
  let component: PenaltyModificationComponent;
  let fixture: ComponentFixture<PenaltyModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyModificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
