import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MawaredEmployeePopupComponent } from './mawared-employee-popup.component';

describe('MawaredEmployeePopupComponent', () => {
  let component: MawaredEmployeePopupComponent;
  let fixture: ComponentFixture<MawaredEmployeePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MawaredEmployeePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MawaredEmployeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
