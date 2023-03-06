import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "@modules/app/app.component";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
    });
  });

  beforeAll(() => {
    fixture = TestBed.createComponent(AppComponent);
  });

  it("should return true", function () {
    expect(fixture.componentInstance).toBeTruthy();
  });
  it("should have title property", function () {
    expect(fixture.componentInstance.title).toBe("customs");
  });
});
