export function* gridIterator<T>(grid: T[][]): Generator<T> {
  for (const column of grid) {
    for (const cell of column) {
      yield cell
    }
  }
}
