import Heap from "heap"
import { getRandomInt } from "./getRandomInt.js"

export type Cell = {
  x: number
  y: number
  type: "WALL" | "PATH"
  weight: number
  selected: boolean
}

export type Maze = Cell[][]

/**
 * @see https://en.wikipedia.org/wiki/Maze_generation_algorithm#Iterative_randomized_Prim.27s_algorithm_.28without_stack.2C_without_sets.29
 */
export function* generateLabyrint(width: number, height: number) {
  const grid: Cell[][] = Array.from({ length: width }, (_, x) =>
    Array.from({ length: height }, (_, y) => ({
      x,
      y,
      type: "WALL",
      weight: Math.random(),
      selected: false,
    })),
  )

  const getSquareNeighours = (cell: Cell): Cell[] =>
    [
      grid[cell.x + 1]?.[cell.y],
      grid[cell.x]?.[cell.y + 1],
      grid[cell.x - 1]?.[cell.y],
      grid[cell.x]?.[cell.y - 1],
    ].filter(Boolean)

  const topBracketNeighbours = (cell: Cell): Cell[] =>
    [
      grid[cell.x + 1]?.[cell.y],
      grid[cell.x + 1]?.[cell.y + 1],
      grid[cell.x]?.[cell.y + 1],
      grid[cell.x - 1]?.[cell.y + 1],
      grid[cell.x - 1]?.[cell.y],
    ].filter(Boolean)

  const bottomBracketNeighbours = (cell: Cell): Cell[] =>
    [
      grid[cell.x + 1]?.[cell.y],
      grid[cell.x + 1]?.[cell.y - 1],
      grid[cell.x]?.[cell.y - 1],
      grid[cell.x - 1]?.[cell.y - 1],
      grid[cell.x - 1]?.[cell.y],
    ].filter(Boolean)

  const rightBracketNeighbours = (cell: Cell): Cell[] =>
    [
      grid[cell.x + 1]?.[cell.y],
      grid[cell.x + 1]?.[cell.y + 1],
      grid[cell.x]?.[cell.y + 1],
      grid[cell.x + 1]?.[cell.y - 1],
      grid[cell.x]?.[cell.y - 1],
    ].filter(Boolean)

  const leftBracketNeighbours = (cell: Cell): Cell[] =>
    [
      grid[cell.x - 1]?.[cell.y],
      grid[cell.x - 1]?.[cell.y + 1],
      grid[cell.x]?.[cell.y + 1],
      grid[cell.x - 1]?.[cell.y - 1],
      grid[cell.x]?.[cell.y - 1],
    ].filter(Boolean)

  const isValidPathCell = (cell: Cell) => {
    return (
      topBracketNeighbours(cell).every(
        (neighbour) => neighbour.type === "WALL",
      ) ||
      rightBracketNeighbours(cell).every(
        (neighbour) => neighbour.type === "WALL",
      ) ||
      bottomBracketNeighbours(cell).every(
        (neighbour) => neighbour.type === "WALL",
      ) ||
      leftBracketNeighbours(cell).every(
        (neighbour) => neighbour.type === "WALL",
      )
    )
  }

  // The heap and weight is used to randomly select the next cell to explore
  const heap = new Heap<Cell>((a, b) => b.weight - a.weight)

  for (
    let cell: Cell | undefined =
      grid[getRandomInt(0, width)][getRandomInt(0, height)];
    cell !== undefined;
    cell = heap.pop()
  ) {
    cell.selected = true

    yield grid

    const valid = isValidPathCell(cell)

    if (valid) {
      cell.type = "PATH"
      getSquareNeighours(cell)
        .filter((cell) => cell.type === "WALL")
        .forEach((cell) => {
          heap.push(cell)
        })
    }

    cell.selected = false
  }

  // Yield the final grid wihtout any selected cells
  yield grid
}
