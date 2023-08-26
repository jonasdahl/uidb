import * as RadixPopover from "@radix-ui/react-popover";
import { ReactNode } from "react";

export function Popover({ children }: { children: ReactNode }) {
  return <RadixPopover.Root>{children}</RadixPopover.Root>;
}

export function PopoverTrigger({ children }: { children: ReactNode }) {
  return <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>;
}

export function PopoverContent({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align="start"
        className="rounded-lg bg-neutral-web-unifi-color-neutral-00 shadow-popover space-y-4 py-4"
      >
        <h4 className="text-sm font-bold px-4">{title}</h4>
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}
