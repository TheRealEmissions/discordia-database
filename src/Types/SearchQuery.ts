export type SearchQuery<T> = {
  [key in keyof T]: T[key];
};
