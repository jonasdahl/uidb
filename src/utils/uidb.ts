import { ZodRawShape, z } from "zod";
import { queryClient } from "./query-client";

export type UidbDevice = z.infer<typeof uidbDeviceSchema>;
export type Uidb = z.infer<typeof uidbSchema>;

/**
 * Get the Uidb file. This might make a request to static.ui.com, or it might return a cached version.
 */
export async function getUidb() {
  return queryClient.fetchQuery({
    queryKey: ["uidb"],
    queryFn: async () => {
      const response = await fetch(
        "https://static.ui.com/fingerprint/ui/public.json"
      );
      const data = await response.json();
      const parsed = uidbSchema.parse(data);
      return parsed;
    },

    // After one hour, the UI will try to get the json file again.
    // Please note that the file itself also has a cache header set from the server
    // so the client will probably just read from disk cache anyways.
    // Also, don't cache anything in test mode.
    staleTime: import.meta.env.MODE === "test" ? 0 : 1000 * 60 * 60, // 1 hour
  });
}

function nullable<T extends z.ZodTypeAny>(shape: T) {
  return shape.optional().nullable().catch(null);
}

function passthroughObject<T extends ZodRawShape>(spec: T) {
  return nullable(z.object(spec).passthrough());
}

// Below defines the minimum required schema for a device in the uidb.
// Many properties will fall back to null if parsing failed.
const radioSchema = passthroughObject({
  gain: nullable(z.number()),
  maxPower: nullable(z.number()),
  maxSpeedMegabitsPerSecond: nullable(z.number()),
});

const unifiNetworkSchema = passthroughObject({
  radios: passthroughObject({ na: radioSchema, ng: radioSchema }),
  numberOfPorts: nullable(z.number()),
  ethernetMaxSpeedMegabitsPerSecond: nullable(z.number()),
  systemIdHexadecimal: nullable(z.string()),
  features: passthroughObject({
    outdoorModeSupport: nullable(z.boolean()),
    bandsteer: nullable(z.boolean()),
    ax: nullable(z.boolean()),
    gen: nullable(z.number()),
    atfDisabled: nullable(z.boolean()),
  }),
  chipset: nullable(z.string()),
  type: nullable(z.string()),
  minimumFirmwareRequired: nullable(z.string()),
  deviceCapabilities: nullable(z.array(nullable(z.string()))),
});

const unifiSchema = passthroughObject({
  adoptability: nullable(z.string()),
  network: nullable(unifiNetworkSchema),
});

const uidbDeviceSchema = z
  .object({
    id: z.string(),
    product: passthroughObject({
      abbrev: nullable(z.string()),
      name: nullable(z.string()),
    }),
    icon: passthroughObject({
      resolutions: z
        .array(z.tuple([z.number(), z.number()]).nullable().catch(null))
        .transform((res) => res.filter(Boolean)),
      id: nullable(z.string()),
    }),
    line: passthroughObject({
      name: nullable(z.string()),
      id: nullable(z.string()),
    }),
    shortnames: nullable(z.array(nullable(z.string()))),
    unifi: unifiSchema,
  })
  .passthrough();

const uidbSchema = z
  .object({
    version: z.string().optional().nullable().catch(null),
    devices: z.array(uidbDeviceSchema).catch([]),
  })
  .passthrough();
