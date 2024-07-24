import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMenuPopupComponent } from './custom-menu-popup.component';

describe('CustomMenuPopupComponent', () => {
  let component: CustomMenuPopupComponent;
  let fixture: ComponentFixture<CustomMenuPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomMenuPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomMenuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
