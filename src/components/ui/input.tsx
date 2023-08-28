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
          "border border-transparent focus:outline-none",
          "hover:bg-neutral-neutral-03-light",
          "focus:border-primary-web-unifi-color-ublue-06",
          "focus:bg-neutral-2",
          "w-32",
          "sm:w-36",
          "md:w-72",
          "w-full",
          "flex-shrink",
          "text-sm",
          props.className
        )}
      />
    );
  }
);
