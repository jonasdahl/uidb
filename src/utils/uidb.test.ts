import { rest } from "msw";
import { setupServer } from "msw/node";
import { describe, expect, it } from "vitest";
import { Uidb, getUidb } from "./uidb";

describe("uidb fetcher", () => {
  it("returns the resolved json object from static.ui.com", async () => {
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

    server.close();
  });

  it("accepts empty devices (only ID required)", async () => {
    const mockedResponse: Uidb = {
      version: "96891c4f-6940-4475-9c4d-15de1863bf1c",
      devices: [{ id: "1" }],
    };

    const server = setupServer(
      rest.get(
        "https://static.ui.com/fingerprint/ui/public.json",
        (_req, res, ctx) => res(ctx.json(mockedResponse))
      )
    );
    server.listen();

    const data = await getUidb();

    expect(data.devices).toEqual([{ id: "1" }]);

    server.close();
  });

  it("accepts strange types for known objects, but yields null for those properties", async () => {
    const mockedResponse: Uidb = {
      version: "96891c4f-6940-4475-9c4d-15de1863bf1c",

      devices: [
        // We expect the product to be an object, so if we get a number this should be parsed as null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a test and not expected from the server
        { id: "1", product: 7 as any },

        // We expect the icon to be an object, so if we get a string this should be parsed as null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a test and not expected from the server
        { id: "2", icon: "string" as any },

        // We expect the icon to be an object, so if we get a string this should be parsed as null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a test and not expected from the server
        { id: "2", icon: { resolutions: ["", ""] as any } },
      ],
    };

    const server = setupServer(
      rest.get(
        "https://static.ui.com/fingerprint/ui/public.json",
        (_req, res, ctx) => res(ctx.json(mockedResponse))
      )
    );
    server.listen();

    const data = await getUidb();

    // The parts that failed to parse should be null
    expect(data.devices).toEqual([
      { id: "1", product: null },
      { id: "2", icon: null },
      { id: "2", icon: { resolutions: [] } },
    ]);

    server.close();
  });
});
