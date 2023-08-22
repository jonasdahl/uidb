import { z } from "zod";

const uidbAbstractType = z.object({ devices: z.array(z.unknown()) });

export async function getUidb() {
  const response = await fetch(
    "https://static.ui.com/fingerprint/ui/public.json"
  );
  const data = await response.json();
  const parsed = uidbAbstractType.parse(data);
  return parsed;
}
