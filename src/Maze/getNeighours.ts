export const getNeighours = <T>(grid: T[][], x: number, y: number): T[] =>
  [
    grid[x + 1]?.[y],
    grid[x]?.[y + 1],
    grid[x - 1]?.[y],
    grid[x]?.[y - 1],
  ].filter(Boolean)
