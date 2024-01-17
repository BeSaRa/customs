import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlinkedViolationsComponent } from './unlinked-violations.component';

describe('UnlinkedViolationsComponent', () => {
  let component: UnlinkedViolationsComponent;
  let fixture: ComponentFixture<UnlinkedViolationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlinkedViolationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnlinkedViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
