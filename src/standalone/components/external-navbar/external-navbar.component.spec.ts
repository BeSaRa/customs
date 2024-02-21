import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalNavbarComponent } from './external-navbar.component';

describe('NavbarComponent', () => {
  let component: ExternalNavbarComponent;
  let fixture: ComponentFixture<ExternalNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
