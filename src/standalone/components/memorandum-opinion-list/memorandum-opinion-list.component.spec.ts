import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemorandumOpinionListComponent } from './memorandum-opinion-list.component';

describe('MemorandumOpinionListComponent', () => {
  let component: MemorandumOpinionListComponent;
  let fixture: ComponentFixture<MemorandumOpinionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemorandumOpinionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MemorandumOpinionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
