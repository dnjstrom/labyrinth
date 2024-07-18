export const lastOf = <T>(generator: Generator<T, any, any>): T => {
  let item

  for (item of generator) {
    continue
  }

  return item!
}
