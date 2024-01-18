import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationSearchComponent } from './situation-search.component';

describe('SituationSearchComponent', () => {
  let component: SituationSearchComponent;
  let fixture: ComponentFixture<SituationSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SituationSearchComponent],
    });
    fixture = TestBed.createComponent(SituationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
