import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApologyPopupComponent } from './apology-popup.component';

describe('ApologyComponent', () => {
  let component: ApologyPopupComponent;
  let fixture: ComponentFixture<ApologyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApologyPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApologyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
