import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { generateLabyrint } from "../Maze/generateMaze.js"
import { mazeToSvgPath } from "../Maze/mazeToSvgPath.js"
import { lastOf } from "../utils/lastOf.js"
import { downloadAsSvg } from "../Menu/downloadAsSvg.js"

export const Generate = () => {
  const [width, setWidth] = useState(50)
  const [height, setHeight] = useState(70)
  const [multiplier, setMultiplier] = useState(1)
  const [iteration, setIteration] = useState(0)

  const ref = useRef<HTMLDivElement>(null)

  const svg = useMemo(() => {
    const w = Math.floor(multiplier * width)
    const h = Math.floor(multiplier * height)
    const maze = lastOf(generateLabyrint(w, h))
    return mazeToSvgPath(maze, {
      cellSize: 1,
      height: h,
      width: w,
    })
  }, [width, multiplier, height, iteration])

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.replaceChildren(svg)
    }
  }, [ref, svg])

  return (
    <div className="h-screen flex">
      <div className="flex flex-col gap-4 p-4 bg-neutral-100">
        <label className="flex flex-col">
          Width:
          <input
            type="number"
            defaultValue={width}
            onChange={(e) => {
              const value = parseInt(e.currentTarget.value, 10)
              if (isNaN(value) || value < 1 || value > 1000) {
                return
              }

              return setWidth(value)
            }}
          />
        </label>
        <label className="flex flex-col">
          Height:
          <input
            type="number"
            defaultValue={height}
            onChange={(e) => {
              const value = parseInt(e.currentTarget.value, 10)
              if (isNaN(value) || value < 1 || value > 1000) {
                return
              }

              return setHeight(value)
            }}
          />
        </label>
        <label className="flex flex-col">
          Multiplier:
          <input
            type="number"
            defaultValue={multiplier}
            onChange={(e) => {
              const value = parseFloat(e.currentTarget.value)
              if (isNaN(value) || value < 1 || value > 100) {
                return
              }

              return setMultiplier(value)
            }}
          />
        </label>

        <button
          className="btn btn-grey"
          onClick={() => {
            setIteration((prev) => prev + 1)
          }}
        >
          Regenerate
        </button>

        <button
          className="mt-auto btn btn-blue"
          onClick={() => {
            downloadAsSvg(svg)
          }}
        >
          Download SVG
        </button>
      </div>

      <div ref={ref} className="w-full h-full p-4"></div>
    </div>
  )
}
