import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMenuUrlHandlerComponent } from './custom-menu-url-handler.component';

describe('CustomMenuUrlHandlerComponent', () => {
  let component: CustomMenuUrlHandlerComponent;
  let fixture: ComponentFixture<CustomMenuUrlHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomMenuUrlHandlerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomMenuUrlHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
