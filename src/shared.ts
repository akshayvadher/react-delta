export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface Delta<T> {
  prev?: T;
  curr: T;
}

export type DeltaArray<T extends unknown[]> = {
  [k in keyof T]: Nullable<Delta<T[k]>>;
};

export type DeltaObject<T extends object> = {
  [k in keyof T]: Nullable<Delta<T[k]>>;
};

export type CleanupCallback = () => void;
