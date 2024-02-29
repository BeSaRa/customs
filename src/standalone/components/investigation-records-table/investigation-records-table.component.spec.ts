import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationRecordsTableComponent } from './investigation-records-table.component';

describe('InvestigationRecordsTableComponent', () => {
  let component: InvestigationRecordsTableComponent;
  let fixture: ComponentFixture<InvestigationRecordsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigationRecordsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigationRecordsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
