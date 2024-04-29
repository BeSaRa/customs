import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievancePopupComponent } from './grievance-popup.component';

describe('GrievancePopupComponent', () => {
  let component: GrievancePopupComponent;
  let fixture: ComponentFixture<GrievancePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievancePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrievancePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
