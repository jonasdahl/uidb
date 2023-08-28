import cx from "classnames";
import { ComponentProps } from "react";

export function Table(props: ComponentProps<"table">) {
  return (
    <table
      {...props}
      className={cx(props.className, "w-full border-separate")}
    />
  );
}

export function Thead(props: ComponentProps<"thead">) {
  return <thead {...props} className={cx(props.className, "sticky top-0")} />;
}

export function Th(props: ComponentProps<"th">) {
  return (
    <th
      {...props}
      className={cx(
        props.className,
        "sticky top-0",
        "text-left font-bold text-sm",
        "px-2 py-1.5",
        "border-b border-solid border-neutral-neutral-03-light bg-white"
      )}
    />
  );
}

export function Tr(props: ComponentProps<"tr">) {
  return <tr {...props} />;
}

export function Tbody(props: ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

export function Td(props: ComponentProps<"td">) {
  return (
    <td
      {...props}
      className={cx(
        props.className,
        "border-b border-solid border-neutral-neutral-03-light",
        "text-text-text-2-light text-sm",
        "align-middle"
      )}
    />
  );
}
