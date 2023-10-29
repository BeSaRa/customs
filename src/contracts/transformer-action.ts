export interface TransformerAction<M> {
  action: 'save' | 'done';
  model?: M;
}
