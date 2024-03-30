import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemorandumPopupComponent } from './memorandum-popup.component';

describe('MemorandumPopupComponent', () => {
  let component: MemorandumPopupComponent;
  let fixture: ComponentFixture<MemorandumPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemorandumPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MemorandumPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
