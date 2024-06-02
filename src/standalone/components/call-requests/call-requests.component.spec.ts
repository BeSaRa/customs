import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRequestsComponent } from './call-requests.component';

describe('CallRequestsComponent', () => {
  let component: CallRequestsComponent;
  let fixture: ComponentFixture<CallRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallRequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CallRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
