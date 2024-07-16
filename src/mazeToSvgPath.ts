import { findIn } from "./findIn.js"
import { Cell, Maze } from "./generateMaze.js"
import { getNeighours } from "./getNeighours.js"
import { gridIterator } from "./gridIterator.js"
import { makeSvgElement } from "./makeSvgElement.js"
import { SVG_NAMESPACE } from "./SVG_NAMESPACE.js"

export const mazeToSvgPath = (
  maze: Maze,
  options: {
    cellSize: number
    width: number
    height: number
  },
) => {
  const { cellSize, width: WIDTH, height: HEIGHT } = options

  const svg = makeSvgElement("svg", {
    width: WIDTH * cellSize,
    height: HEIGHT * cellSize,
    version: "1.1",
    xmlns: SVG_NAMESPACE,
  })

  const defs = makeSvgElement("defs", {})
  const linearGradient = makeSvgElement("linearGradient", {
    id: "gradient",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%",
  })
  const stop1 = makeSvgElement("stop", {
    offset: "0%",
    "stop-color": "mediumseagreen",
  })
  const stop2 = makeSvgElement("stop", {
    offset: "100%",
    "stop-color": "teal",
  })

  linearGradient.replaceChildren(stop1, stop2)
  defs.appendChild(linearGradient)
  svg.appendChild(defs)

  const bg = makeSvgElement("rect", {
    width: WIDTH * cellSize,
    height: HEIGHT * cellSize,
    fill: "url(#gradient)",
  })

  svg.appendChild(bg)

  const entrypoint = findIn(gridIterator(maze), (cell) => cell.type === "PATH")
  const drawInstructions: string[] = []

  if (!entrypoint) {
    return svg
  }

  const stack: Cell[] = getNeighours(maze, entrypoint.x, entrypoint.y).filter(
    (cell) => cell.type === "PATH",
  )

  const visited = new Set<Cell>([entrypoint])

  for (
    let current = stack.pop();
    current !== undefined;
    current = stack.pop()
  ) {
    if (visited.has(current)) {
      continue
    }

    visited.add(current)

    const pathNeighbours = getNeighours(maze, current.x, current.y).filter(
      (cell) => cell.type === "PATH",
    )
    const [previouslyVisited] = pathNeighbours.filter((neighbour) =>
      visited.has(neighbour),
    )

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
    drawInstructions.push(
      `M ${previouslyVisited.x * cellSize + cellSize / 2} ${
        previouslyVisited.y * cellSize + cellSize / 2
      } L ${current.x * cellSize + cellSize / 2} ${
        current.y * cellSize + cellSize / 2
      }`,
    )

    pathNeighbours
      .filter((neighbour) => !visited.has(neighbour))
      .forEach((cell) => {
        stack.push(cell)
      })
  }

  svg.appendChild(
    makeSvgElement("path", {
      d: drawInstructions.join(" "),
      stroke: "white",
      "stroke-width": cellSize,
      fill: "transparent",
      "stroke-linecap": "square",
    }),
  )

  return svg
}
