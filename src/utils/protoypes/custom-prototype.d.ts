interface IChangeParams {
  [index: string]: unknown;
}

// noinspection JSUnusedGlobalSymbols
interface String {
  change(model: IChangeParams): string;

  getExtension(): string;
}
