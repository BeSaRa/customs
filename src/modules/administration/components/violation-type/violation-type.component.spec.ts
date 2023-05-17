import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationTypeComponent } from './violation-type.component';

describe('ViolationTypeComponent', () => {
  let component: ViolationTypeComponent;
  let fixture: ComponentFixture<ViolationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolationTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
