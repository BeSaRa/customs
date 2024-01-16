import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { OffenderDecissionFormComponent } from "./offender-decission-form.component";

describe("OffenderDecissionFormComponent", () => {
  let component: OffenderDecissionFormComponent;
  let fixture: ComponentFixture<OffenderDecissionFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OffenderDecissionFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffenderDecissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
