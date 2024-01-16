import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ButtonsCaseWrapperComponent } from "./buttons-case-wrapper.component";

describe("ButtonsCaseWrapperComponent", () => {
  let component: ButtonsCaseWrapperComponent;
  let fixture: ComponentFixture<ButtonsCaseWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonsCaseWrapperComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsCaseWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
