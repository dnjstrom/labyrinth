export const downloadAsSvg = (svg: SVGSVGElement) => {
  const element = document.createElement("a")

  element.setAttribute(
    "href",
    "data:image/svg+xml;utf8," + encodeURIComponent(svg.outerHTML),
  )
  element.setAttribute("download", "maze.svg")

  element.style.display = "none"

  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}
