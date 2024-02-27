import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesForExternalUsersComponent } from './cases-for-external-users.component';

describe('CasesForExternalUsersComponent', () => {
  let component: CasesForExternalUsersComponent;
  let fixture: ComponentFixture<CasesForExternalUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesForExternalUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CasesForExternalUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
