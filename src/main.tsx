import React from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", loader: () => redirect("/list") },
  { path: "/list", lazy: () => import("./routes/list/route") },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
