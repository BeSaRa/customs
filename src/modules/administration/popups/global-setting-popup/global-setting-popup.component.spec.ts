import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSettingPopupComponent } from './global-setting-popup.component';

describe('GlobalSettingPopupComponent', () => {
  let component: GlobalSettingPopupComponent;
  let fixture: ComponentFixture<GlobalSettingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalSettingPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSettingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
