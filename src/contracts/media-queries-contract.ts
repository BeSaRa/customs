import { EventEmitter } from '@angular/core';

export interface MediaQueriesContract {
  xs: EventEmitter<{ width: number; name: keyof MediaQueriesContract }>;
  sm: EventEmitter<{ width: number; name: keyof MediaQueriesContract }>;
  md: EventEmitter<{ width: number; name: keyof MediaQueriesContract }>;
  lg: EventEmitter<{ width: number; name: keyof MediaQueriesContract }>;
  xl: EventEmitter<{ width: number; name: keyof MediaQueriesContract }>;
  xxl: EventEmitter<{ width: number; name: keyof MediaQueriesContract }>;
}
