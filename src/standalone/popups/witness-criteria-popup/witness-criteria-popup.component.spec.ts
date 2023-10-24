import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WitnessCriteriaPopupComponent } from './witness-criteria-popup.component';

describe('WitnessCriteriaPopupComponent', () => {
  let component: WitnessCriteriaPopupComponent;
  let fixture: ComponentFixture<WitnessCriteriaPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WitnessCriteriaPopupComponent],
    });
    fixture = TestBed.createComponent(WitnessCriteriaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
