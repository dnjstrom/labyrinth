import invariant from "tiny-invariant"
import { downloadAsSvg } from "./downloadAsSvg.js"
import { useState } from "react"
import clsx from "clsx"
import { Link } from "react-router-dom"

export const Menu = () => {
  const [visible, setVisible] = useState(false)

  const onClick = () => {
    const svg = document.querySelector("svg")

    invariant(svg, "Unable to find SVG element")

    downloadAsSvg(svg)
  }

  return (
    <button
      className={clsx(
        "fixed top-1 right-1 z-50 outline-none px-4 py-2 opacity-30 hover:opacity-100 hover:cursor-pointer focus-visible:opacity-100",
        visible && "!opacity-100",
      )}
      onClick={() => setVisible((prev) => !prev)}
    >
      <svg className="w-[8px] h-[32px] ">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "mediumseagreen" }} />
            <stop offset="100%" style={{ stopColor: "teal" }} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" />
        <rect y="28%" width="100%" height="10%" fill="white" />
        <rect y="61%" width="100%" height="10%" fill="white" />
      </svg>

      {visible && (
        <div className="flex flex-col text-left absolute bottom-0 right-4 bg-white rounded-md shadow-md translate-y-full py-2 whitespace-nowrap border">
          <button className="px-4 py-2 hover:bg-neutral-100" onClick={onClick}>
            Download SVG
          </button>
          <Link
            className="px-4 py-2 text-black hover:bg-neutral-100 hover:no-underline"
            to="/generate"
          >
            Maze generator
          </Link>
        </div>
      )}
    </button>
  )
}
