const ns = "http://www.w3.org/2000/svg"

export const makeSvgElement = <T extends keyof SVGElementTagNameMap>(
  elementType: T,
  attributes: Record<string, unknown>,
) => {
  const element = document.createElementNS(ns, elementType)

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttributeNS(null, key, `${value}`)
  }

  return element
}
