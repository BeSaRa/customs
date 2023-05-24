import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MawaredEmployeeComponent } from './mawared-employee.component';

describe('MawaredEmployeeComponent', () => {
  let component: MawaredEmployeeComponent;
  let fixture: ComponentFixture<MawaredEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MawaredEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MawaredEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
