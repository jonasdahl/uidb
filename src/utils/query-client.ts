import { QueryClient } from "@tanstack/react-query";

// The react-query client that will be used throughout the app, for caching and deduping uidb
export const queryClient = new QueryClient();
