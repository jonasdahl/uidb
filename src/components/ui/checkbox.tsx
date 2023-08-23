import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { ReactNode, useId } from "react";

export function Checkbox({ children }: { children: ReactNode }) {
  const id = useId();

  return (
    <div className="space-x-2 flex items-center flex-row">
      <RadixCheckbox.Root
        className="h-4 w-4 rounded border border-solid border-neutral-6"
        id={id}
      >
        <RadixCheckbox.Indicator>
          <div className="w-full h-full bg-u-blue-6-primary flex items-center justify-items-center"></div>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label className="text-sm" htmlFor={id}>
        {children}
      </label>
    </div>
  );
}
