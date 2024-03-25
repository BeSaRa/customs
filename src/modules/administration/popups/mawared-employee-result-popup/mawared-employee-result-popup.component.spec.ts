import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MawaredEmployeeResultPopupComponent } from './mawared-employee-result-popup.component';

describe('MawaredEmployeeResultPopupComponent', () => {
  let component: MawaredEmployeeResultPopupComponent;
  let fixture: ComponentFixture<MawaredEmployeeResultPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MawaredEmployeeResultPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MawaredEmployeeResultPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
