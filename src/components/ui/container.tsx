import cx from "classnames";
import { ComponentProps, forwardRef } from "react";

export const Container = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function Container(props, ref) {
    return (
      <div
        {...props}
        className={cx(props.className, "mx-auto px-5 max-w-7xl w-full")}
        ref={ref}
      />
    );
  }
);
