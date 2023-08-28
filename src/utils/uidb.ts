import { z } from "zod";
import { queryClient } from "./query-client";

// This defines the minimum required schema for a device in the uidb.
const uidbDeviceSchema = z.object({
  id: z.string().optional().nullable(),
  product: z
    .object({
      abbrev: z.string().optional().nullable(),
      name: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  icon: z
    .object({
      resolutions: z.array(z.tuple([z.number(), z.number()])),
      id: z.string(),
    })
    .optional()
    .nullable(),
  line: z
    .object({
      name: z.string().optional().nullable(),
      id: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  shortnames: z.array(z.string().optional().nullable()).optional().nullable(),
});

const uidbSchema = z.object({
  version: z.string().optional().nullable(),
  devices: z.array(uidbDeviceSchema),
});

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
      const parsed = uidbSchema.passthrough().parse(data);
      return parsed;
    },
  });
}

export type UidbDevice = z.infer<typeof uidbDeviceSchema>;
