import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderAttachmentsComponent } from './offender-attachments.component';

describe('OffenderAttachmentsComponent', () => {
  let component: OffenderAttachmentsComponent;
  let fixture: ComponentFixture<OffenderAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffenderAttachmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OffenderAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
