import { Outlet } from "react-router-dom";
import { TopBar } from "../components/top-bar";

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
