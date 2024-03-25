import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MawaredDepartmentResultPopupComponent } from './mawared-department-result-popup.component';

describe('MawaredDepartmentResultPopupComponent', () => {
  let component: MawaredDepartmentResultPopupComponent;
  let fixture: ComponentFixture<MawaredDepartmentResultPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MawaredDepartmentResultPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MawaredDepartmentResultPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
