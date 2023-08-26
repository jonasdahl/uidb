import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { ReactNode, useId } from "react";
import { IconCheck } from "./icons/check";

export function Checkbox({
  children,
  checked,
  onChange,
}: {
  children: ReactNode;
  checked?: boolean;
  onChange?: (isChecked: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="space-x-2 flex items-center flex-row focus-within:border-primary-web-unifi-color-ublue-06 px-px rounded focus-within:outline outline-1 outline-primary-web-unifi-color-ublue-06 outline-offset-1">
      <RadixCheckbox.Root
        style={{ height: "18px", width: "18px" }}
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="outline-none"
      >
        <div className="w-full h-full rounded border border-solid border-neutral-6 hover:border-primary-web-unifi-color-ublue-06" />
        <RadixCheckbox.Indicator>
          <div style={{ marginTop: "-18px" }}>
            <div className="w-full h-full rounded bg-u-blue-6-primary flex items-center justify-items-center text-white border border-solid border-u-blue-6-primary">
              <IconCheck label="Selected" />
            </div>
          </div>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      <label className="text-sm" htmlFor={id}>
        {children}
      </label>
    </div>
  );
}
