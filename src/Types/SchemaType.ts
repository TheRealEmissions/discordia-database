export interface Schema {
  _id?: string;
}

export type KeyValueType<T> = (T extends any[]
  ? {
      type: T extends string[]
        ? StringConstructor[]
        : T extends number[]
        ? NumberConstructor[]
        : T extends boolean[]
        ? BooleanConstructor[]
        : DateConstructor[];
    }
  : {
      type: T extends string
        ? StringConstructor
        : T extends number
        ? NumberConstructor
        : T extends boolean
        ? BooleanConstructor
        : DateConstructor;
    }) &
  ({ required: false; default: Exclude<T, undefined> } | { required: true });

export type SchemaType<T extends Schema> = {
  [K in keyof T]: Exclude<KeyValueType<T[K]>, undefined>;
};
