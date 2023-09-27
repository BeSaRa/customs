import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentTypeComponent } from './attachment-type.component';

describe('AttachmentTypeComponent', () => {
  let component: AttachmentTypeComponent;
  let fixture: ComponentFixture<AttachmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttachmentTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
