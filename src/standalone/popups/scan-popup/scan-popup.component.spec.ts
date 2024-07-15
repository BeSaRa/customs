import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanPopupComponent } from './scan-popup.component';

describe('ScanPopupComponent', () => {
  let component: ScanPopupComponent;
  let fixture: ComponentFixture<ScanPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
