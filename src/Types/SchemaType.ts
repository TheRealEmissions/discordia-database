export interface Schema {}

export type KeyValueType<T> = (T extends any[]
  ? {
      type: T extends string[]
        ? StringConstructor[]
        : T extends number[]
        ? NumberConstructor[]
        : T extends boolean[]
        ? BooleanConstructor[]
        : T extends Date[]
        ? DateConstructor[]
        : never;
    }
  : {
      type: T extends string
        ? StringConstructor
        : T extends number
        ? NumberConstructor
        : T extends boolean
        ? BooleanConstructor
        : T extends Date
        ? DateConstructor
        : never;
    }) &
  ({ required: false; default?: T } | { required: true } | {});

export type SchemaType<T extends Schema> = {
  [K in keyof T]: KeyValueType<T[K]>;
};
