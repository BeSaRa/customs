import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatementPopupComponent } from './request-statement-popup.component';

describe('RequestStatementPopupComponent', () => {
  let component: RequestStatementPopupComponent;
  let fixture: ComponentFixture<RequestStatementPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestStatementPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStatementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
