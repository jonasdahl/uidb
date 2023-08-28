import { useLocation } from "react-router-dom";

/**
 * React hook that returns a valid path ready to be sent as returnTo parameter in a link URL.
 */
export function useCurrentReturnToUrl() {
  const location = useLocation();
  return encodeURIComponent(`${location.pathname}${location.search}`);
}

/**
 * React hook that returns the returnTo parameter from the URL, or a fallback if it's not present.
 */
export function useReturnToUrl(fallback: string) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo");
  return returnTo === "null" ? fallback : returnTo ?? fallback;
}
