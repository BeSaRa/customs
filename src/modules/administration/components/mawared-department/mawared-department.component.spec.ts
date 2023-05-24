import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MawaredDepartmentComponent } from './mawared-department.component';

describe('MawaredDepartmentComponent', () => {
  let component: MawaredDepartmentComponent;
  let fixture: ComponentFixture<MawaredDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MawaredDepartmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MawaredDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
