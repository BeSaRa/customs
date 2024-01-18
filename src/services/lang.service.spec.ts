import { TestBed } from '@angular/core/testing';

import { LangService } from './lang.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LangCodes } from '@enums/lang-codes';

describe('LangService', () => {
  let service: LangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be arabic first selected language', function () {
    expect(service.getCurrent().code).toBe(LangCodes.AR);
  });

  it('should toggle the language to english language', function (done) {
    service.change$.subscribe((value) => {
      expect(value.code).toBe(LangCodes.EN);
      done();
    });
    service.toggleLang();
  });

  it('should set current language to arabic ', function (done) {
    service.change$.subscribe((lang) => {
      expect(lang.code).toBe(LangCodes.AR);
      done();
    });
    service.setCurrent({
      code: LangCodes.AR,
      toggleTo: LangCodes.EN,
      id: 1,
      name: 'Arabic',
      direction: 'rtl',
    });
  });
});
