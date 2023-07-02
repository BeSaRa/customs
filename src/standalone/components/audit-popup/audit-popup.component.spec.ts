import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPopupComponent } from './audit-popup.component';

describe('AuditComponent', () => {
  let component: AuditPopupComponent;
  let fixture: ComponentFixture<AuditPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuditPopupComponent],
    });
    fixture = TestBed.createComponent(AuditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
