import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WitnessesListComponent } from './witnesses-list.component';

describe('OffenderListComponent', () => {
  let component: WitnessesListComponent;
  let fixture: ComponentFixture<WitnessesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WitnessesListComponent],
    });
    fixture = TestBed.createComponent(WitnessesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
