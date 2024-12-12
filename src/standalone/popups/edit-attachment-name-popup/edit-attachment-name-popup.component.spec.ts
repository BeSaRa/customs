import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAttachmentNamePopupComponent } from './edit-attachment-name-popup.component';

describe('EditAttachmentNamePopupComponent', () => {
  let component: EditAttachmentNamePopupComponent;
  let fixture: ComponentFixture<EditAttachmentNamePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAttachmentNamePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAttachmentNamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
