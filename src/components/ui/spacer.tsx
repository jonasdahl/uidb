import { ComponentProps, forwardRef } from "react";

type Props = ComponentProps<"div">;

export const Spacer = forwardRef<HTMLDivElement, Props>(function Spacer(
  props,
  ref
) {
  return <div {...props} style={{ flex: 1 }} ref={ref} />;
});
