import { ComponentProps, forwardRef } from "react";

type Props = ComponentProps<"div">;

export const Spacer = forwardRef<HTMLDivElement, Props>(function Spacer(
  props,
  ref
) {
  return <div {...props} className="flex-grow min-w-4" ref={ref} />;
});
