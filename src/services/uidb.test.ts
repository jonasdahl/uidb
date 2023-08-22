import { rest } from "msw";
import { setupServer } from "msw/node";
import { describe, expect, it } from "vitest";
import { getUidb } from "./uidb";

describe("uidb fetcher", () => {
  it("returns the resolved json object", async () => {
    // Mock an "empty" (no devices) uidb response using msw
    const mockedResponse = {
      version: "96891c4f-6940-4475-9c4d-15de1863bf1c",
      devices: [],
    };

    const server = setupServer(
      rest.get(
        "https://static.ui.com/fingerprint/ui/public.json",
        (_req, res, ctx) => res(ctx.json(mockedResponse))
      )
    );
    server.listen();

    const data = await getUidb();

    expect(data.version).toEqual("96891c4f-6940-4475-9c4d-15de1863bf1c"); // as in the mocked object
    expect(data.devices.length).toEqual(0); // no devices in the mocked response
  });
});
