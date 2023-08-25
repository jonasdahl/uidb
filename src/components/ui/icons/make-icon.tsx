import * as AccessibleIcon from "@radix-ui/react-accessible-icon";

export function makeIcon(ReactComponent: React.FunctionComponent<object>) {
  return function ({ label }: { label: string }) {
    return (
      <AccessibleIcon.Root label={label}>
        <ReactComponent />
      </AccessibleIcon.Root>
    );
  };
}
