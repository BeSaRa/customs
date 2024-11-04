import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserTeamsPopupComponent } from './internal-user-teams-popup.component';

describe('InternalUserTeamsPopupComponent', () => {
  let component: InternalUserTeamsPopupComponent;
  let fixture: ComponentFixture<InternalUserTeamsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalUserTeamsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalUserTeamsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
