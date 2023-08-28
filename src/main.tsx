/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import "./reset.css";

import "./index.css";
import { queryClient } from "./utils/query-client.ts";

const router = createBrowserRouter([
  {
    lazy: () => import("./routes/root.tsx"),
    children: [
      {
        path: "/devices/:deviceId",
        lazy: () => import("./routes/devices.$deviceId/_route.tsx"),
      },
      { path: "/devices", lazy: () => import("./routes/devices/_route.tsx") },
      { path: "/", loader: () => redirect("/devices") },
      { path: "*", lazy: () => import("./routes/404.tsx") },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement />
    </QueryClientProvider>
  </React.StrictMode>
);
