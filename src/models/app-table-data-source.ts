import {
  BehaviorSubject,
  isObservable,
  Observable,
  ReplaySubject,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { DataSource } from '@angular/cdk/collections';

export class AppTableDataSource<M> extends DataSource<M> {
  private _data = new BehaviorSubject<M[]>([]);
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(items: Observable<M[]> | M[]) {
    super();
    if (isObservable(items)) {
      this.listenToDataChanges(items);
    } else {
      this._data.next(items);
    }
  }

  get data() {
    return this._data.value;
  }

  connect(): Observable<M[]> {
    return this._data;
  }

  disconnect(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }

  private listenToDataChanges(items: Observable<M[]>) {
    items
      .pipe(takeUntil(this._destroy$))
      .pipe(tap((data) => this._data.next(data)))
      .subscribe({
        next: () => {
          console.log('NEXT');
        },
        error: (e) => {
          console.log(e);
          console.log('ERROR');
        },
        complete: () => {
          console.log('COMPLETE');
        },
      });
  }
}
