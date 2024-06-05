import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWidgetComponent } from './new-widget.component';

describe('NewWidgetComponent', () => {
  let component: NewWidgetComponent;
  let fixture: ComponentFixture<NewWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
