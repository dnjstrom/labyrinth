import Heap from "heap"
import { getRandomInt } from "./getRandomInt.js"
import { searchAlternating } from "./searchAlternating.js"
import invariant from "tiny-invariant"

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
  const maze: Cell[][] = Array.from({ length: width }, (_, x) =>
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
      maze[cell.x + 1]?.[cell.y],
      maze[cell.x]?.[cell.y + 1],
      maze[cell.x - 1]?.[cell.y],
      maze[cell.x]?.[cell.y - 1],
    ].filter(Boolean)

  const topBracketNeighbours = (cell: Cell): Cell[] =>
    [
      maze[cell.x + 1]?.[cell.y],
      maze[cell.x + 1]?.[cell.y + 1],
      maze[cell.x]?.[cell.y + 1],
      maze[cell.x - 1]?.[cell.y + 1],
      maze[cell.x - 1]?.[cell.y],
    ].filter(Boolean)

  const bottomBracketNeighbours = (cell: Cell): Cell[] =>
    [
      maze[cell.x + 1]?.[cell.y],
      maze[cell.x + 1]?.[cell.y - 1],
      maze[cell.x]?.[cell.y - 1],
      maze[cell.x - 1]?.[cell.y - 1],
      maze[cell.x - 1]?.[cell.y],
    ].filter(Boolean)

  const rightBracketNeighbours = (cell: Cell): Cell[] =>
    [
      maze[cell.x + 1]?.[cell.y],
      maze[cell.x + 1]?.[cell.y + 1],
      maze[cell.x]?.[cell.y + 1],
      maze[cell.x + 1]?.[cell.y - 1],
      maze[cell.x]?.[cell.y - 1],
    ].filter(Boolean)

  const leftBracketNeighbours = (cell: Cell): Cell[] =>
    [
      maze[cell.x - 1]?.[cell.y],
      maze[cell.x - 1]?.[cell.y + 1],
      maze[cell.x]?.[cell.y + 1],
      maze[cell.x - 1]?.[cell.y - 1],
      maze[cell.x]?.[cell.y - 1],
    ].filter(Boolean)

  const isEdgeCell = (cell: Cell) => {
    return (
      // The edge walls are 2 cells thick
      cell.x <= 1 || cell.y <= 1 || cell.x >= width - 2 || cell.y >= height - 2
    )
  }

  const isValidPathCell = (cell: Cell) => {
    return (
      !isEdgeCell(cell) &&
      (topBracketNeighbours(cell).every(
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
        ))
    )
  }

  // The heap and weight is used to randomly select the next cell to explore
  const heap = new Heap<Cell>((a, b) => b.weight - a.weight)

  for (
    let cell: Cell | undefined =
      maze[getRandomInt(0, width)][getRandomInt(0, height)];
    cell !== undefined;
    cell = heap.pop()
  ) {
    cell.selected = true

    yield maze

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

  const topRow = maze.map((column) => column[2])

  const topEntrypoint = searchAlternating(
    topRow,
    Math.floor(width / 4),
    (cell) => cell.type === "PATH",
  )

  if (topEntrypoint) {
    maze[topEntrypoint.x][0].type = "PATH"
    maze[topEntrypoint.x][1].type = "PATH"
  }

  const bottomRow = maze.map((column) => column[column.length - 3])

  const bottomEntrypoint = searchAlternating(
    bottomRow,
    Math.floor((3 * width) / 4),
    (cell) => cell.type === "PATH",
  )

  if (bottomEntrypoint) {
    maze[bottomEntrypoint.x][height - 2].type = "PATH"
    maze[bottomEntrypoint.x][height - 1].type = "PATH"
  }

  // Yield the final grid wihtout any selected cells
  yield maze
}
