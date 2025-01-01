import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiedPenaltyComponent } from './modified-penalty.component';

describe('ModifiedPenaltyComponent', () => {
  let component: ModifiedPenaltyComponent;
  let fixture: ComponentFixture<ModifiedPenaltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifiedPenaltyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifiedPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
