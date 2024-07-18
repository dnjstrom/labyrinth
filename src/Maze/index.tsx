import { delay } from "../utils/delay.js"
import { generateLabyrint } from "./generateMaze.js"
import { lastOf } from "../utils/lastOf.js"
import { mazeToSvgPath } from "./mazeToSvgPath.js"
import { useEffect, useRef } from "react"

// @ts-expect-error https://vitejs.dev/guide/env-and-mode
let shouldAnimate = import.meta.env.MODE !== "development"

let activeMazeIndex = 0

export const Maze = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const container = ref.current

      const observer = new ResizeObserver(async () => {
        try {
          container.replaceChildren() // Clear the maze

          const currentMazeIndex = (activeMazeIndex += 1)

          const cellSize = 8
          const WIDTH = Math.floor(container.clientWidth / cellSize)
          const HEIGHT = Math.floor(container.clientHeight / cellSize)

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

              const svg = mazeToSvgPath(maze, mazeOptions)
              container.replaceChildren(svg)
              await delay(0)
            }
          } else {
            const maze = lastOf(generateLabyrint(WIDTH, HEIGHT))
            const svg = mazeToSvgPath(maze, mazeOptions)
            container.replaceChildren(svg)
          }
        } finally {
          shouldAnimate = false // Stop animating after the first load
        }
      })

      observer.observe(container)
    }
  }, [ref])

  return <div ref={ref} className="w-full h-full"></div>
}
