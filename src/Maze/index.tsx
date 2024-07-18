import { delay } from "../utils/delay.js"
import { generateLabyrint } from "./generateMaze.js"
import { lastOf } from "../utils/lastOf.js"
import { mazeToSvgPath } from "./mazeToSvgPath.js"
import { useEffect, useRef } from "react"

let activeMazeIndex = 0

export const Maze = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const container = ref.current

      const observer = new ResizeObserver(async () => {
        container.replaceChildren() // Clear the maze

        const currentMazeIndex = (activeMazeIndex += 1)

        const cellSize = 16
        const WIDTH = Math.floor(container.clientWidth / cellSize)
        const HEIGHT = Math.floor(container.clientHeight / cellSize)

        const mazeOptions = {
          cellSize,
          width: WIDTH,
          height: HEIGHT,
        }

        for (const maze of generateLabyrint(WIDTH, HEIGHT)) {
          if (currentMazeIndex !== activeMazeIndex) {
            return // Cancel drawing if a new animation has started
          }

          const svg = mazeToSvgPath(maze, mazeOptions)
          container.replaceChildren(svg)
          await delay(30)
        }
      })

      observer.observe(container)
    }

    return () => {
      if (ref.current) {
        // Clear the maze on unmount
        ref.current.replaceChildren()
      }
    }
  }, [ref])

  return <div ref={ref} className="w-full h-full"></div>
}
