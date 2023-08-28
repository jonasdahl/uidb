import cx from "classnames";
import { ComponentProps, forwardRef } from "react";

type Props = ComponentProps<"button"> & { isActive?: boolean };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  props,
  ref
) {
  return (
    <button ref={ref} {...props} className={cx(props.className, "text-sm")}>
      Reset
    </button>
  );
});
