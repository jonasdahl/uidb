import { Link } from "../components/link";
import { Stack } from "../components/ui/stack";

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
