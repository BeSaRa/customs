import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMenuDetailsComponent } from './dynamic-menu-details.component';

describe('DynamicMenuDetailsComponent', () => {
  let component: DynamicMenuDetailsComponent;
  let fixture: ComponentFixture<DynamicMenuDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicMenuDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicMenuDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
