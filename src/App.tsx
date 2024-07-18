import { Maze } from "./Maze.js"
import { Menu } from "./Menu.js"

export const App = () => (
  <div className="h-screen w-screen p-10 sm:p-20 gap-10 items-center flex flex-col">
    <Menu />

    <Maze />

    <a
      className="text-center text-neutral-500 text-sm"
      href="https://en.wikipedia.org/wiki/Maze_generation_algorithm#Iterative_randomized_Prim.27s_algorithm_.28without_stack.2C_without_sets.29"
    >
      The maze was generated as a minimum spanning tree using Prim’s algorithm
      on a grid graph with random edge weights
    </a>
  </div>
)
