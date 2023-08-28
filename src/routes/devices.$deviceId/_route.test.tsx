import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Uidb } from "../../utils/uidb";

describe("device route", () => {
  it("shows the device details", async () => {
    // Set up a mocked device as response from the server
    const mockedResponse: Uidb = {
      version: "96891c4f-6940-4475-9c4d-15de1863bf1c",
      devices: [{ id: "device-id-1", product: { name: "Unifi Test Product" } }],
    };

    // Start the server
    const server = setupServer(
      rest.get(
        "https://static.ui.com/fingerprint/ui/public.json",
        (_req, res, ctx) => res(ctx.json(mockedResponse))
      )
    );
    server.listen();

    // Add the route to the mocked router and render it
    const router = createMemoryRouter(
      [{ path: "/devices/:deviceId", lazy: () => import("./_route") }],
      { initialEntries: ["/devices/device-id-1"] }
    );
    render(<RouterProvider router={router} />);

    // Expect the name and ID to be in the document
    expect(await screen.findAllByText("Unifi Test Product")).toBeTruthy();
    expect(await screen.getByText("device-id-1")).toBeTruthy();

    // Stop server
    server.close();
  });

  it("shows raw json when button is clicked", async () => {
    // Set up a mocked device as response from the server
    const mockedResponse: Uidb = {
      version: "96891c4f-6940-4475-9c4d-15de1863bf1c",
      devices: [{ id: "device-id-1", product: { name: "Unifi Test Product" } }],
    };

    // Start the server
    const server = setupServer(
      rest.get(
        "https://static.ui.com/fingerprint/ui/public.json",
        (_req, res, ctx) => res(ctx.json(mockedResponse))
      )
    );
    server.listen();

    // Add the route to the mocked router and render it
    const router = createMemoryRouter(
      [{ path: "/devices/:deviceId", lazy: () => import("./_route") }],
      { initialEntries: ["/devices/device-id-1"] }
    );
    render(<RouterProvider router={router} />);

    expect(await screen.findAllByText("Unifi Test Product")).toBeTruthy();

    const button = await screen.getByRole("button", {
      name: "See All Details as JSON",
    });
    userEvent.click(button);

    const codeElement = await screen.findByRole("code");
    expect(JSON.parse(codeElement.textContent!)).toEqual({
      id: "device-id-1",
      product: { name: "Unifi Test Product" },
    });

    // Stop server
    server.close();
  });
});
