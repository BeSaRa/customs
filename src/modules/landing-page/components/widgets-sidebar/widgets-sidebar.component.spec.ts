import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsSidebarComponent } from './widgets-sidebar.component';

describe('WidgetsSidebarComponent', () => {
  let component: WidgetsSidebarComponent;
  let fixture: ComponentFixture<WidgetsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetsSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
