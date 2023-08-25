import cx from "classnames";
import { ComponentProps, forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  function Button(props, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className={cx(
          "data-[state=open]:text-primary-web-unifi-color-ublue-06",
          "data-[state=open]:bg-neutral-web-unifi-color-neutral-01",
          "text-sm",
          "text-text-text-3",
          "p-1.5",
          "hover:bg-neutral-web-unifi-color-neutral-02",
          "rounded",
          "outline-0",
          "border",
          "border-transparent",
          "focus:border-primary-web-unifi-color-ublue-06",
          props.className
        )}
      />
    );
  }
);
