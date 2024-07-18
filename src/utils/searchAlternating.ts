function* alternateFrom<T>(list: T[], startingIndex: number) {
  const lowerItems = list.slice(0, startingIndex).reverse()
  const upperItems = list.slice(startingIndex) // Includes the starting index

  for (let i = 0; i < Math.max(lowerItems.length, upperItems.length); i++) {
    if (upperItems[i]) {
      yield upperItems[i]
    }

    if (lowerItems[i]) {
      yield lowerItems[i]
    }
  }
}

export const searchAlternating = <T>(
  list: T[],
  startingIndex: number,
  predicate: (item: T) => boolean,
) => {
  for (const item of alternateFrom(list, startingIndex)) {
    if (predicate(item)) {
      return item
    }
  }
}
