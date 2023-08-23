/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import "./reset.css";

import "./index.css";

const router = createBrowserRouter([
  {
    lazy: () => import("./routes/root.tsx"),
    children: [
      {
        path: "/devices/:deviceId",
        lazy: () => import("./routes/devices.$deviceId/route.tsx"),
      },
      { path: "/devices", lazy: () => import("./routes/devices/route.tsx") },
      { path: "/", loader: () => redirect("/devices") },
      { path: "*", lazy: () => import("./routes/404.tsx") },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement />
    </QueryClientProvider>
  </React.StrictMode>
);
