export interface FilterColumnContract {
  name: string;
  filter: boolean;
  type: 'text' | 'select' | 'date' | 'none';
  bindKey: string;
  filterName: string;
  options?: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindSelectValue?: string | ((item: any) => any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindSelectLabel?: string | ((item: any) => any);
}
