import cx from "classnames";
import { ComponentProps, ReactNode } from "react";

export function ProductGrid(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cx(
        props.className,
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full"
      )}
    />
  );
}

export function ProductGridItem({
  label,
  description,
  image,
  title,
}: {
  label: ReactNode;
  image: ReactNode;
  description: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="border border-solid border-neutral-neutral-03-light rounded-lg relative">
      <div
        style={{ height: "100px" }}
        className="bg-neutral-web-unifi-color-neutral-01 relative"
      >
        <div
          className="absolute bg-neutral-web-unifi-color-neutral-00 px-1 py-0.5 text-primary-web-unifi-color-ublue-06 text-xs flex"
          style={{ top: "3px", right: "2.6667px" }}
        >
          {label}
        </div>

        <div className="p-2 flex flex-1 h-full [&>*]:flex-1 [&>*]:object-scale-down">
          {image}
        </div>
      </div>
      <div className="p-2">
        <div
          style={{ height: "40px" }}
          className="text-text-text-1-light text-sm text-ellipsis whitespace-nowrap overflow-hidden"
        >
          {title}
        </div>
        <div className="text-text-text-3 text-xs text-ellipsis whitespace-nowrap overflow-hidden">
          {description}
        </div>
      </div>
    </div>
  );
}
