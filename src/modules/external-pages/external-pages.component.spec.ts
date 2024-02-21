import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalPagesComponent } from './external-pages.component';

describe('ExternalPagesComponent', () => {
  let component: ExternalPagesComponent;
  let fixture: ComponentFixture<ExternalPagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalPagesComponent],
    });
    fixture = TestBed.createComponent(ExternalPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
