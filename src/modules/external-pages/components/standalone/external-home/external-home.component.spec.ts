import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalHomeComponent } from './external-home.component';

describe('GrievanceComponent', () => {
  let component: ExternalHomeComponent;
  let fixture: ComponentFixture<ExternalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
