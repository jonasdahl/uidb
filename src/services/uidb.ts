import { z } from "zod";

const uidbAbstractType = z.object({
  version: z.string().optional().nullable(),
  devices: z.array(z.unknown()),
});

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
});

export async function getUidb() {
  const response = await fetch(
    "https://static.ui.com/fingerprint/ui/public.json"
  );
  const data = await response.json();
  const parsed = uidbAbstractType.parse(data);
  return parsed;
}
