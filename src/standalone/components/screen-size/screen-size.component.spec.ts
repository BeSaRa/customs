import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenSizeComponent } from './screen-size.component';
import { MediaQueriesContract } from '@contracts/media-queries-contract';

describe('ScreenSizeComponent', () => {
  let component: ScreenSizeComponent;
  let fixture: ComponentFixture<ScreenSizeComponent>;
  const spy = jest.fn();
  beforeAll(() => {
    window.addEventListener('resize', spy);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenSizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each<{ width: number; expected: string }>([
    { width: 0, expected: 'xs' },
    { width: 640, expected: 'sm' },
    { width: 768, expected: 'md' },
    { width: 1024, expected: 'lg' },
    { width: 1280, expected: 'xl' },
    { width: 1536, expected: 'xxl' },
  ])(
    'should $width queries work fine width $expected',
    function ({ width, expected }, done) {
      // noinspection JSConstantReassignment
      window.innerWidth = width;
      component[expected as keyof MediaQueriesContract].subscribe((v) => {
        expect(width).toBe(v.width);
        expect(expected).toBe(v.name);
        (done as unknown as jest.DoneCallback)();
      });
      component.resize();
    }
  );
});
