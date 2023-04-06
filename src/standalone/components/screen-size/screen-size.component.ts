import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { debounceTime, filter, map, startWith, Subject } from 'rxjs';
import { SizeContract } from '@contracts/size-contract';
import { MediaQueriesContract } from '@contracts/media-queries-contract';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-screen-size',
  standalone: true,
  templateUrl: './screen-size.component.html',
  styleUrls: ['./screen-size.component.scss'],
  imports: [NgIf],
})
export class ScreenSizeComponent implements OnInit, MediaQueriesContract {
  @Output()
  readonly xs: EventEmitter<{
    width: number;
    name: keyof MediaQueriesContract;
  }> = new EventEmitter<{ width: number; name: keyof MediaQueriesContract }>();
  @Output()
  readonly sm: EventEmitter<{
    width: number;
    name: keyof MediaQueriesContract;
  }> = new EventEmitter<{ width: number; name: keyof MediaQueriesContract }>();
  @Output()
  readonly md: EventEmitter<{
    width: number;
    name: keyof MediaQueriesContract;
  }> = new EventEmitter<{ width: number; name: keyof MediaQueriesContract }>();
  @Output()
  readonly lg: EventEmitter<{
    width: number;
    name: keyof MediaQueriesContract;
  }> = new EventEmitter<{ width: number; name: keyof MediaQueriesContract }>();
  @Output()
  readonly xl: EventEmitter<{
    width: number;
    name: keyof MediaQueriesContract;
  }> = new EventEmitter<{ width: number; name: keyof MediaQueriesContract }>();
  @Output()
  readonly xxl: EventEmitter<{
    width: number;
    name: keyof MediaQueriesContract;
  }> = new EventEmitter<{ width: number; name: keyof MediaQueriesContract }>();
  @Input()
  debugMode = false;

  private resize$: Subject<number> = new Subject<number>();
  private sizes: SizeContract[] = [
    {
      name: 'xs',
      min: 0,
      max: 640,
      callback: (val, size) => this.checkSize(val, size),
    },
    {
      name: 'sm',
      min: 640,
      max: 768,
      callback: (val, size) => this.checkSize(val, size),
    },
    {
      name: 'md',
      min: 768,
      max: 1024,
      callback: (val, size) => this.checkSize(val, size),
    },
    {
      name: 'lg',
      min: 1024,
      max: 1280,
      callback: (val, size) => this.checkSize(val, size),
    },
    {
      name: 'xl',
      min: 1280,
      max: 1536,
      callback: (val, size) => this.checkSize(val, size),
    },
    {
      name: 'xxl',
      min: 1536,
      max: Infinity,
      callback: (val, size) => this.checkSize(val, size),
    },
  ];

  ngOnInit(): void {
    this.listenToWindowResize();
  }

  @HostListener('window:resize')
  resize(): void {
    this.resize$.next(window.innerWidth);
  }

  private listenToWindowResize() {
    this.resize$
      .pipe(debounceTime(200))
      .pipe(startWith(window.innerWidth))
      .pipe(map((value) => this.checkCorrespondentSize(value)))
      .pipe(filter((size): size is SizeContract => !!size))
      .subscribe((val) => {
        this[val.name].next({ width: window.innerWidth, name: val.name });
      });
  }

  private checkCorrespondentSize(val: number): SizeContract | undefined {
    return this.sizes.find((item) => item.callback(val, item));
  }

  private checkSize(
    val: number,
    size: { min: number; max: number; name: string }
  ): boolean {
    return val >= size.min && val < size.max;
  }
}
