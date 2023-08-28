import { ReactNode } from "react";

export function Code({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-xs border border-solid border-neutral-web-unifi-color-neutral-02 bg-neutral-web-unifi-color-neutral-01 rounded p-4 overflow-auto"
      style={{ maxHeight: "50vh" }}
    >
      <code className="whitespace-pre">{children}</code>
    </div>
  );
}
