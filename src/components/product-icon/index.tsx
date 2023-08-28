import { ComponentProps, ReactNode } from "react";
import { sortBy } from "remeda";
import { UidbDevice } from "../../utils/uidb";

/**
 * An icon of the product that is at lease minWidth wide and minHeight tall.
 */
export function ProductIcon({
  icon,
  minWidth,
  minHeight,
  fallback,
  ...props
}: {
  icon: UidbDevice["icon"];
  minWidth: number;
  minHeight: number;
  fallback?: ReactNode;
} & ComponentProps<"img">) {
  if (!icon) {
    return fallback ?? null;
  }
  // Sort resolutions smallest first so we can iterate and find the first one that fits our requirements
  const resolutions = sortBy(icon.resolutions, (res) => res[0] * res[1]);
  const resolution =
    resolutions.find((res) => res[0] >= minWidth && res[1] >= minHeight) ??
    resolutions[resolutions.length - 1]; // Fall back to the largest resolution if no match was found

  if (!resolution) {
    return fallback ?? null;
  }

  const src = `https://static.ui.com/fingerprint/ui/icons/${icon.id}_${resolution[0]}x${resolution[1]}.png`;

  return <img {...props} src={src} />;
}
