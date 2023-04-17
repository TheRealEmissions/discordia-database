export type DocumentConstructor<T> = {
  [key in keyof T]: T[key];
};
