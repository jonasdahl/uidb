import * as AccessibleIcon from "@radix-ui/react-accessible-icon";

export function makeIcon(
  ReactComponent: React.FunctionComponent<{ className?: string }>
) {
  return function ({
    label,
    className,
  }: {
    label: string;
    className?: string;
  }) {
    return (
      <AccessibleIcon.Root label={label}>
        <ReactComponent className={className} />
      </AccessibleIcon.Root>
    );
  };
}
