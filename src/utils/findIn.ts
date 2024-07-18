export const findIn = <T>(
  iterator: Generator<T>,
  predicate: (value: T) => boolean,
): T | undefined => {
  for (const value of iterator) {
    if (predicate(value)) {
      return value
    }
  }
}
