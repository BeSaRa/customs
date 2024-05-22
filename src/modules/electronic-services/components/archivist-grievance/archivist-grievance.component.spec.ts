import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivistGrievanceComponent } from './archivist-grievance.component';

describe('ArchivistGrievanceComponent', () => {
  let component: ArchivistGrievanceComponent;
  let fixture: ComponentFixture<ArchivistGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivistGrievanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivistGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
