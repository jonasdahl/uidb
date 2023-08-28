import { z } from "zod";
import { queryClient } from "./query-client";

// This defines the minimum required schema for a device in the uidb.
const uidbDeviceSchema = z
  .object({
    id: z.string().optional().nullable(),
    product: z
      .object({
        abbrev: z.string().optional().nullable(),
        name: z.string().optional().nullable(),
      })
      .passthrough()
      .optional()
      .nullable(),
    icon: z
      .object({
        resolutions: z.array(z.tuple([z.number(), z.number()])),
        id: z.string(),
      })
      .passthrough()
      .optional()
      .nullable(),
    line: z
      .object({
        name: z.string().optional().nullable(),
        id: z.string().optional().nullable(),
      })
      .passthrough()
      .optional()
      .nullable(),
    shortnames: z.array(z.string().optional().nullable()).optional().nullable(),
    unifi: z
      .object({
        adoptability: z.string().nullable().optional(),
        network: z
          .object({
            radios: z
              .object({
                na: z
                  .object({
                    gain: z.number().nullable().optional(),
                    maxPower: z.number().nullable().optional(),
                    maxSpeedMegabitsPerSecond: z.number().nullable().optional(),
                  })
                  .passthrough()
                  .nullable()
                  .optional(),
                ng: z
                  .object({
                    gain: z.number().nullable().optional(),
                    maxPower: z.number().nullable().optional(),
                    maxSpeedMegabitsPerSecond: z.number().nullable().optional(),
                  })
                  .passthrough()
                  .nullable()
                  .optional(),
              })
              .passthrough()
              .nullable()
              .optional(),
            numberOfPorts: z.number().nullable().optional(),
            ethernetMaxSpeedMegabitsPerSecond: z.number().nullable().optional(),
            systemIdHexadecimal: z.string().nullable().optional(),
            features: z
              .object({
                outdoorModeSupport: z.boolean().nullable().optional(),
                bandsteer: z.boolean().nullable().optional(),
                ax: z.boolean().nullable().optional(),
                gen: z.number().nullable().optional(),
                atfDisabled: z.boolean().nullable().optional(),
              })
              .passthrough()
              .nullable()
              .optional(),
            chipset: z.string().nullable().optional(),
            type: z.string().nullable().optional(),
            minimumFirmwareRequired: z.string().nullable().optional(),
            deviceCapabilities: z
              .array(z.string().nullable().optional())
              .nullable()
              .optional(),
          })
          .passthrough()
          .nullable()
          .optional(),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

const uidbSchema = z
  .object({
    version: z.string().optional().nullable(),
    devices: z.array(uidbDeviceSchema),
  })
  .passthrough();

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
  });
}

export type UidbDevice = z.infer<typeof uidbDeviceSchema>;
