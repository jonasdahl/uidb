import { useQuery } from "@tanstack/react-query";
import { getUidb } from "../services/uidb";

export function useUidb() {
  return useQuery(["uidb"], async () => {
    return getUidb();
  });
}
