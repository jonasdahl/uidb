import { z } from "zod";

export const uidbDeviceType = z.object({
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

const uidbAbstractType = z.object({
  version: z.string().optional().nullable(),
  devices: z.array(uidbDeviceType),
});

export async function getUidb() {
  const response = await fetch(
    "https://static.ui.com/fingerprint/ui/public.json"
  );
  const data = await response.json();
  const parsed = uidbAbstractType.parse(data);
  return parsed;
}

export type UidbDevice = z.infer<typeof uidbDeviceType>;
