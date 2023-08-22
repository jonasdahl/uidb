import cx from "classnames";
import { ComponentProps, forwardRef } from "react";

type Props = ComponentProps<"div"> & { direction?: "row" | "column" };

export const Stack = forwardRef<HTMLDivElement, Props>(function Stack(
  { direction = "column", ...props },
  ref
) {
  return (
    <div
      {...props}
      className={cx(
        "flex",
        direction === "column" ? "flex-col" : "flex-row",
        props.className
      )}
      ref={ref}
    />
  );
});
