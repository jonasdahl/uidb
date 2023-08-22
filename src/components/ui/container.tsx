import { ComponentProps, forwardRef } from "react";

export const Container = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function Container(props, ref) {
    return (
      <div
        {...props}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "1200px",
          paddingLeft: "20px",
          paddingRight: "20px",
          ...props.style,
        }}
        ref={ref}
      />
    );
  }
);
