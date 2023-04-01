import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LangService } from '@services/lang.service';
import { By } from '@angular/platform-browser';

jest.mock('@services/lang.service');
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [LangService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggle language should be called ', () => {
    const spy = jest.spyOn(component, 'toggleLanguage');
    const btn = fixture.debugElement.query(By.css('button'));

    btn.triggerEventHandler('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should call log one time', function () {
    // const spy = jest.spyOn(component, 'log');
    // expect(spy).not.toHaveBeenCalled();
  });

  it('should call log one time', function () {
    // const spy = jest.spyOn(component, 'log');
    // const deEle = fixture.debugElement.query(By.css('app-screen-size'));
    // deEle.triggerEventHandler('xs', { width: 0, name: 'xs' });
    // expect(spy).not.toHaveBeenCalled();
  });
});
