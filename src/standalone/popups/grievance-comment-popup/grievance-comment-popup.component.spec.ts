import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceCommentPopupComponent } from './grievance-comment-popup.component';

describe('GrievanceCommentPopupComponent', () => {
  let component: GrievanceCommentPopupComponent;
  let fixture: ComponentFixture<GrievanceCommentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievanceCommentPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrievanceCommentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
