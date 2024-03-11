import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRequestRecordsTableComponent } from './call-request-records-table.component';

describe('CallRequestRecordsTableComponent', () => {
  let component: CallRequestRecordsTableComponent;
  let fixture: ComponentFixture<CallRequestRecordsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallRequestRecordsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CallRequestRecordsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
