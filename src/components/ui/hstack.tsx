import { ComponentProps, forwardRef } from "react";
import { Stack } from "./stack";

export const HStack = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function HStack(props, ref) {
    return <Stack {...props} ref={ref} direction="row" />;
  }
);
