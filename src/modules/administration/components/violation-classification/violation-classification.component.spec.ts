import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationClassificationComponent } from './violation-classification.component';

describe('ViolationClassificationComponent', () => {
  let component: ViolationClassificationComponent;
  let fixture: ComponentFixture<ViolationClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolationClassificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
