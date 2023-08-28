import cx from "classnames";
import { ComponentProps } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

type Props = { enableFocusStyle?: boolean } & ComponentProps<
  typeof ReactRouterLink
>;

export function Link({ enableFocusStyle, ...props }: Props) {
  return (
    <ReactRouterLink
      {...props}
      className={cx(
        props.className,
        enableFocusStyle &&
          "focus:outline-1 focus:outline-primary-web-unifi-color-ublue-06 focus:outline-none focus:-outline-offset-1"
      )}
    />
  );
}
