import { Outlet } from "react-router-dom";
import { Link } from "../components/link";
import { TopBar } from "../components/top-bar";
import { Stack } from "../components/ui/stack";

/**
 * The root layout for the app. It will render the top bar and the current route.
 */
export function Component() {
  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

/**
 * When anything in the app throws or errors, this will render instead.
 * Please add more specific error boundaries closer to the route that is
 * throwing the error.
 */
export function ErrorBoundary() {
  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <Stack className="text-center space-y-6 py-20">
        <h1 className="text-4xl">Whoops!</h1>
        <h2>
          An error occurred. Please try again later or visit the{" "}
          <Link to="/" className="underline">
            Index page
          </Link>
          .
        </h2>
      </Stack>
    </div>
  );
}
