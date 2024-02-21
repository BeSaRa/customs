import { ComponentFixture, TestBed } from '@angular/core/testing';

import ExternalMainComponent from './external-main.component';

describe('MainComponent', () => {
  let component: ExternalMainComponent;
  let fixture: ComponentFixture<ExternalMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalMainComponent],
    });
    fixture = TestBed.createComponent(ExternalMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
