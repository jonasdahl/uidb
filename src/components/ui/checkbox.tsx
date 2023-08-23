import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { ReactNode, useId } from "react";
import { ReactComponent as CheckIcon } from "../../assets/check.svg";

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
    <div className="space-x-2 flex items-center flex-row">
      <RadixCheckbox.Root
        className="h-4 w-4"
        id={id}
        checked={checked}
        onCheckedChange={onChange}
      >
        <div className="w-full h-full rounded border border-solid border-neutral-6" />
        <RadixCheckbox.Indicator>
          <div className="w-full h-full rounded bg-u-blue-6-primary flex items-center justify-items-center text-white -mt-4">
            <CheckIcon />
          </div>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      <label className="text-sm" htmlFor={id}>
        {children}
      </label>
    </div>
  );
}
