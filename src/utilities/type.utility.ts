/**
 * Constructs a type with selected properties of Type set to optional.
 */
export type PartialPick<T, K extends keyof T> =
  // partial picked keys
  Partial<Pick<T, K>> &
  // everything else except picked keys
  Omit<T, K>;
