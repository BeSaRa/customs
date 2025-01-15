export type SortType = 'file_name' | 'size' | 'date' | 'sentiment';

export interface SearchQueryContract {
  query: string;
  facet: string;
  sort: SortType;
  page_size: number;
  page_number: number;
}
