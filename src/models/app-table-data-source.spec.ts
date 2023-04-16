import { AppTableDataSource } from './app-table-data-source';
import { of } from 'rxjs';

describe('TableDataSource', () => {
  it('should create an instance', () => {
    expect(new AppTableDataSource(of([]))).toBeTruthy();
  });
});
