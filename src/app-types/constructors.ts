export type Constructor<T> = new (...args: unknown[]) => T;
export type AbstractConstructor<T> = abstract new (...args: unknown[]) => T;
