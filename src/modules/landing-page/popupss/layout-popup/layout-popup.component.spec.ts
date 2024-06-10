import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPopupComponent } from './layout-popup.component';

describe('LayoutPopupComponent', () => {
  let component: LayoutPopupComponent;
  let fixture: ComponentFixture<LayoutPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
