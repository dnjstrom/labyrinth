import { SVG_NAMESPACE } from "../constants.js"

export const makeSvgElement = <T extends keyof SVGElementTagNameMap>(
  elementType: T,
  attributes: Record<string, unknown>,
) => {
  const element = document.createElementNS(SVG_NAMESPACE, elementType)

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, `${value}`)
  }

  return element
}
