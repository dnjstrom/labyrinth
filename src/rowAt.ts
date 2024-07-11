export const rowAt = <T>(maze: T[][], y: number) =>
  maze.map((column) => column[y])
