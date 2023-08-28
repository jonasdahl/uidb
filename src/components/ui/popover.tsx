import * as RadixPopover from "@radix-ui/react-popover";
import { ReactNode } from "react";

export function Popover({ children }: { children: ReactNode }) {
  return <RadixPopover.Root>{children}</RadixPopover.Root>;
}

export function PopoverTrigger({ children }: { children: ReactNode }) {
  return <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>;
}

export function PopoverContent({ children }: { children: ReactNode }) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align="start"
        className="rounded-lg bg-neutral-web-unifi-color-neutral-00 shadow-popover space-y-4 py-4"
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}

export function PopoverTitle({ children }: { children: ReactNode }) {
  return <h4 className="text-sm font-bold px-4">{children}</h4>;
}

export function PopoverBody({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-2 max-h-60 overflow-auto px-4 py-0.5">
      {children}
    </div>
  );
}

export function PopoverFooter({ children }: { children: ReactNode }) {
  return <div className="px-4">{children}</div>;
}
