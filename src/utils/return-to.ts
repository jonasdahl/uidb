import { useLocation } from "react-router-dom";

export function useCurrentReturnToUrl() {
  const location = useLocation();
  return encodeURIComponent(`${location.pathname}${location.search}`);
}

export function useReturnToUrl() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo");
  return returnTo;
}
