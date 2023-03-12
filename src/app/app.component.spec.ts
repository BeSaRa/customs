import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    });
  });

  beforeAll(() => {
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should return true', function () {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
