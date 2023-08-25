import { ComponentProps, forwardRef } from "react";
import { Button } from "./button";

type Props = ComponentProps<typeof Button> & {
  /**
   * A descriptive label that identifies the action of the button.
   * Important for accessibility and, for example, screen readers.
   */
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButton({ label, ...props }, ref) {
    return <Button ref={ref} {...props} aria-label={label} />;
  }
);
