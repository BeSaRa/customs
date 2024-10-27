import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetOptionsMenuComponent } from './widget-options-menu.component';

describe('WidgetOptionsMenuComponent', () => {
  let component: WidgetOptionsMenuComponent;
  let fixture: ComponentFixture<WidgetOptionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetOptionsMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetOptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
