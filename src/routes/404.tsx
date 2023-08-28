import { Link } from "../components/link";
import { Stack } from "../components/ui/stack";

/**
 * The page that renders when a route is not found. It will render inside the root layout.
 */
export function Component() {
  return (
    <Stack className="text-center space-y-6 py-20">
      <h1 className="text-4xl">Whoops!</h1>
      <h2>
        We couldn't find that page. Please try again later or visit the{" "}
        <Link to="/" className="underline">
          Index page
        </Link>
        .
      </h2>
    </Stack>
  );
}
