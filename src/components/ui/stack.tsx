import { ComponentProps, forwardRef } from "react";

type Props = ComponentProps<"div"> & { direction?: "row" | "column" };

export const Stack = forwardRef<HTMLDivElement, Props>(function Stack(
  { direction = "column", ...props },
  ref
) {
  return (
    <div
      {...props}
      style={{ display: "flex", flexDirection: direction, ...props.style }}
      ref={ref}
    />
  );
});
