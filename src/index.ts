import { delay } from "./delay.js"
import { generateLabyrint } from "./generateMaze.js"
import { mazeToSvg } from "./mazeToSvg.js"
import { lastOf } from "./lastOf.js"
import { makeSvgElement } from "./makeSvgElement.js"
import { searchAlternating } from "./searchAlternating.js"
import invariant from "tiny-invariant"

let shouldAnimate = true

const app = document.getElementById("app")

if (!app) {
  throw new Error("Unable to find #app element")
}

let activeMazeIndex = 0

const observer = new ResizeObserver(async () => {
  try {
    app.replaceChildren() // Clear the maze

    const currentMazeIndex = (activeMazeIndex += 1)

    const cellSize = 8
    const WIDTH = Math.floor(app.clientWidth / cellSize)
    const HEIGHT = Math.floor(app.clientHeight / cellSize)

    const mazeOptions = {
      cellSize,
      width: WIDTH,
      height: HEIGHT,
    }

    let maze

    if (shouldAnimate) {
      for (maze of generateLabyrint(WIDTH - 2, HEIGHT - 2)) {
        if (currentMazeIndex !== activeMazeIndex) {
          return // Cancel drawing if a new animation has started
        }

        app.replaceChildren(mazeToSvg(maze, mazeOptions))
        await delay(0)
      }
    } else {
      maze = lastOf(generateLabyrint(WIDTH - 2, HEIGHT - 2))
      app.replaceChildren(mazeToSvg(maze, mazeOptions))
    }

    invariant(maze, "Unable to generate maze")

    const topRow = maze.map((column) => column[0])

    const topEntrypoint = searchAlternating(
      topRow,
      Math.floor(WIDTH / 3),
      (cell) => cell.type === "PATH",
    )

    invariant(topEntrypoint, "Unable to find top entry point")

    app.querySelector("svg")?.appendChild(
      makeSvgElement("rect", {
        width: cellSize,
        height: cellSize,
        fill: "#fff",
        x: (topEntrypoint.x + 1) * cellSize,
        y: 0,
      }),
    )

    const bottomRow = maze.map((column) => column[column.length - 1])

    const bottomEntrypoint = searchAlternating(
      bottomRow,
      Math.floor((2 * WIDTH) / 3),
      (cell) => cell.type === "PATH",
    )

    invariant(bottomEntrypoint, "Unable to find top entry point")

    app.querySelector("svg")?.appendChild(
      makeSvgElement("rect", {
        width: cellSize,
        height: cellSize,
        fill: "#fff",
        x: (bottomEntrypoint.x + 1) * cellSize,
        y: (HEIGHT - 1) * cellSize,
      }),
    )
  } finally {
    shouldAnimate = false // Stop animating after the first load
  }
})

observer.observe(app)
