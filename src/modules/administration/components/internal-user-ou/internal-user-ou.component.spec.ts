import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserOUComponent } from './internal-user-ou.component';

describe('InternalUserOUComponent', () => {
  let component: InternalUserOUComponent;
  let fixture: ComponentFixture<InternalUserOUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalUserOUComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalUserOUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
