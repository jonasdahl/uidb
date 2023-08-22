import { rest } from "msw";

export const handlers = [
  rest.get(
    "https://static.ui.com/fingerprint/ui/public.json",
    (_req, res, ctx) => {
      return res(ctx.json({ version: "96891c4f-6940-4475-9c4d-15de1863bf1c" }));
    }
  ),
];
