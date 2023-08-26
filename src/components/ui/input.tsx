import cx from "classnames";
import { ComponentProps, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  function Input(props, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={cx(
          "bg-neutral-2",
          "rounded",
          "flex-1",
          "h-8",
          "px-2",
          "border border-transparent outline-none",
          "hover:bg-neutral-neutral-03-light",
          "focus:border-primary-web-unifi-color-ublue-06",
          "focus:bg-neutral-2",
          "w-44",
          "md:w-72",
          "text-sm",
          props.className
        )}
      />
    );
  }
);
