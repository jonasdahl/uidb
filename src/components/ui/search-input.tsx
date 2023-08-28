import { Combobox } from "@headlessui/react";
import cx from "classnames";
import { Fragment, ReactNode } from "react";
import { splitString } from "../../utils/split-string";
import { HStack } from "./h-stack";
import { IconSearch } from "./icons/search";
import { Input } from "./input";

/**
 * A search input field that shows suggestions and acts when selected.
 */
export function SearchInput<TSuggestion extends { id: string }>({
  onSelect,
  onChange,
  suggestions,
  renderSuggestion,
}: {
  onSelect: (value: string) => void;
  onChange: (value: string) => void;
  suggestions: TSuggestion[];
  renderSuggestion: (
    suggestion: TSuggestion,
    info: { selected: boolean; active: boolean }
  ) => ReactNode;
}) {
  return (
    <HStack className="space-x-2 relative">
      <div className="relative">
        <Combobox nullable onChange={onSelect}>
          <Combobox.Input
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search..."
            autoComplete="off"
            as={Input}
            className="pl-8"
          />
          <Combobox.Options className="absolute w-full rounded-b-lg bg-neutral-web-unifi-color-neutral-00 shadow-popover py-2 z-popover">
            {suggestions.length === 0 ? (
              <div className="px-2 py-1.5 text-sm border border-solid border-transparent">
                No suggestions. Try another search.
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <Combobox.Option key={suggestion.id} value={suggestion.id}>
                  {(info) => (
                    <Fragment>{renderSuggestion(suggestion, info)}</Fragment>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Combobox>
      </div>
      <IconSearch label="Search..." className="absolute" />
    </HStack>
  );
}

export function SearchInputSuggestion({
  active,
  selected,
  label,
  searchString,
}: {
  selected: boolean;
  active: boolean;
  label: string;
  searchString: string;
}) {
  const parts = splitString(searchString, label);

  return (
    <div
      className={cx(
        "text-sm text-text-web-unifi-text-2 px-2 py-1.5 rounded-sm cursor-pointer border border-solid",
        "hover:bg-neutral-web-unifi-color-neutral-02 hover:text-text-web-unifi-text-2",
        selected || active
          ? "border-primary-web-unifi-color-ublue-06"
          : "border-transparent"
      )}
    >
      {parts.map((part, i) => {
        return (
          <span
            key={i}
            className={part.match ? "font-bold underline" : undefined}
          >
            {part.content}
          </span>
        );
      })}
    </div>
  );
}
