import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Uidb } from "../../utils/uidb";

describe("device list route", () => {
  it("shows a device in the list if it is in the response", async () => {
    // Set up a mocked device as response from the server
    const mockedResponse: Uidb = {
      version: "96891c4f-6940-4475-9c4d-15de1863bf1c",
      devices: [
        {
          id: "754221d9-2a1d-44c0-b422-23d8f394b7a7",
          product: { name: "Unifi Test Product" },
        },
      ],
    };

    // Start the server
    const server = setupServer(
      rest.get(
        "https://static.ui.com/fingerprint/ui/public.json",
        (_req, res, ctx) => res(ctx.json(mockedResponse))
      )
    );
    server.listen();

    const router = createMemoryRouter([
      { path: "*", lazy: () => import("./_route") },
    ]);
    render(<RouterProvider router={router} />);

    const element = await screen.findByText("Unifi Test Product");

    // Expect the element to be a link to the device page
    expect(element.closest("a")?.href).toBe(
      "http://localhost:3000/devices/754221d9-2a1d-44c0-b422-23d8f394b7a7"
    );

    // Stop server
    server.close();
  });
});
