import { Link, useRouteError } from "react-router-dom"

const ErrorPage = () => {
  const error = useRouteError() as any
  console.error(error)

  return (
    <div
      id="error-page"
      className="flex flex-col gap-4 justify-center items-center h-screen"
    >
      <h1 className="text-2xl">Not Found</h1>
      <p>
        There is no page at <b>{window.location.href}</b>
      </p>

      <Link to="/">Go to home page</Link>
    </div>
  )
}

export default ErrorPage
