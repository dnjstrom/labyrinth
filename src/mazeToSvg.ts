import { Maze } from "./generateMaze.js"
import { SVG_NAMESPACE } from "./SVG_NAMESPACE.js"

export const mazeToSvg = (
  maze: Maze,
  options: {
    cellSize: number
    width: number
    height: number
  },
) => {
  const { cellSize, width: WIDTH, height: HEIGHT } = options
  var svg = document.createElementNS(SVG_NAMESPACE, "svg")
  svg.setAttributeNS(null, "width", `${WIDTH * cellSize}`)
  svg.setAttributeNS(null, "height", `${HEIGHT * cellSize}`)

  const bg = document.createElementNS(SVG_NAMESPACE, "rect")
  bg.setAttributeNS(null, "width", `${WIDTH * cellSize}`)
  bg.setAttributeNS(null, "height", `${HEIGHT * cellSize}`)
  bg.setAttributeNS(null, "fill", "#000")
  svg.appendChild(bg)

  for (let x = 0; x < maze.length; x++) {
    for (let y = 0; y < maze[x].length; y++) {
      const cell = maze[x][y]

      var rect = document.createElementNS(SVG_NAMESPACE, "rect")
      rect.setAttributeNS(null, "width", `${cellSize}`)
      rect.setAttributeNS(null, "height", `${cellSize}`)
      rect.setAttributeNS(
        null,
        "fill",
        cell.selected ? "#f00" : cell.type === "WALL" ? "#000" : "#fff",
      )
      rect.setAttributeNS(null, "x", `${x * cellSize}`)
      rect.setAttributeNS(null, "y", `${y * cellSize}`)
      svg.appendChild(rect)
    }
  }

  return svg
}
