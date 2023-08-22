import { Outlet } from "react-router-dom";
import { TopBar } from "../components/top-bar";
import { Stack } from "../components/ui/stack";

export function Component() {
  return (
    <Stack>
      <TopBar />
      <div>
        <Outlet />
      </div>
    </Stack>
  );
}
