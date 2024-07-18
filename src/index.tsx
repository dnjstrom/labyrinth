import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.js"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Generate } from "./Generate/index.js"
import ErrorPage from "./ErrorPage.js"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/generate",
      element: <Generate />,
    },
  ],
  {
    basename: "/maze",
  },
)

const root = document.getElementById("root")!
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
