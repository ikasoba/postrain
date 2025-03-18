type Has<T, R> = [T] extends [never] ? never : R;

export type Result<T, E = never> =
  Has<T, { isOk: true; value: T }> | Has<E, { isOk: false; err: E }>;

export function ok(val?: void): Result<void, never>;
export function ok<T>(val: T): Result<T, never>;
export function ok<T>(val: T) {
  return {
    isOk: true,
    value: val
  }
}

export function err(val?: void): Result<never, void>;
export function err<T>(val: T): Result<never, T>;
export function err<T>(val: T) {
  return {
    isOk: false,
    err: val
  }
}

