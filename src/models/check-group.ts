import { Lookup } from '@models/lookup';
import { chunks } from '@utils/utils';

export class CheckGroup<T extends { id: number } = { id: number }> {
  rows!: T[][];
  idList!: number[];

  constructor(public group: Lookup, private items: T[], private selected: number[] = [], chunkCount = 3) {
    this.getItemsId();
    this.filterSelection();
    this.updateChunkCount(chunkCount);
  }

  protected get length() {
    return this.list.length;
  }

  get list(): T[] {
    return this.items;
  }

  isFull(): boolean {
    return !this.isEmpty() && this.list.length === this.selected.length;
  }

  isEmpty(): boolean {
    return !this.selected.length;
  }

  isIndeterminate(): boolean {
    return !this.isEmpty() && !this.isFull();
  }

  addToSelection(id: number): void {
    this.selected.push(id);
    this.selected = this.selected.slice();
  }

  toggle(id: number): void {
    return this.isSelected(id) ? this.removeFromSelection(id) : this.addToSelection(id);
  }

  removeFromSelection(id: number): void {
    this.selected.splice(this.selected.indexOf(id), 1);
    this.selected = this.selected.slice();
  }

  selectAll(): void {
    this.selected = this.list.map(item => {
      return item.id;
    });
  }

  deSelectAll(): void {
    this.selected = [];
  }

  setSelected(selected: number[]): void {
    this.selected = selected;
    this.filterSelection();
  }

  updateChunkCount(chunkCount: number): void {
    this.rows = chunks(this.items, chunkCount);
  }

  private filterSelection(): void {
    // filter selected
    this.selected = this.selected.filter(id => {
      return this.idList.indexOf(id) !== -1;
    });
  }

  private getItemsId(): void {
    // get items id
    this.idList = this.list.map(item => {
      return item.id;
    });
  }

  isSelected(id: number): boolean {
    return this.selected.indexOf(id) !== -1;
  }

  toggleSelection(): void {
    if (this.isEmpty() || this.isIndeterminate()) {
      this.selected = this.idList.slice();
    } else {
      this.selected = [];
    }
  }

  hasSelectedValue(): boolean {
    return !!this.selected.length;
  }

  getSelectedValue(): number[] {
    return this.selected.slice();
  }

  getNames(): string {
    return this.group.getNames();
  }
}
