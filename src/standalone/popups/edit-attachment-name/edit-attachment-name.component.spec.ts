import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttachmentNameComponent } from './edit-attachment-name.component';

describe('EditAttachmentNameComponent', () => {
  let component: EditAttachmentNameComponent;
  let fixture: ComponentFixture<EditAttachmentNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAttachmentNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAttachmentNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
