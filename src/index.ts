import { delay } from "./delay.js"
import { generateLabyrint } from "./generateMaze.js"
import { mazeToSvg } from "./mazeToSvg.js"
import { lastOf } from "./lastOf.js"

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

    if (shouldAnimate) {
      for (const maze of generateLabyrint(WIDTH, HEIGHT)) {
        if (currentMazeIndex !== activeMazeIndex) {
          return // Cancel drawing if a new animation has started
        }

        app.replaceChildren(mazeToSvg(maze, mazeOptions))
        await delay(0)
      }
    } else {
      const maze = lastOf(generateLabyrint(WIDTH, HEIGHT))
      app.replaceChildren(mazeToSvg(maze, mazeOptions))
    }
  } finally {
    shouldAnimate = false // Stop animating after the first load
  }
})

observer.observe(app)
