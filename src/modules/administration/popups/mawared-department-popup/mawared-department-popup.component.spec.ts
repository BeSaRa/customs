import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MawaredDepartmentPopupComponent } from './mawared-department-popup.component';

describe('MawaredDepartmentPopupComponent', () => {
  let component: MawaredDepartmentPopupComponent;
  let fixture: ComponentFixture<MawaredDepartmentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MawaredDepartmentPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MawaredDepartmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
