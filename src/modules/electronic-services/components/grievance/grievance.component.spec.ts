import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceComponent } from './grievance.component';

describe('GrievanceComponent', () => {
  let component: GrievanceComponent;
  let fixture: ComponentFixture<GrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
