import { Combobox } from "@headlessui/react";
import * as Popover from "@radix-ui/react-popover";
import cx from "classnames";
import { matchSorter } from "match-sorter";
import { useState } from "react";
import { pipe, sortBy, uniqBy } from "remeda";
import { Link } from "../../components/link";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Container } from "../../components/ui/container";
import { HStack } from "../../components/ui/hstack";
import { IconGrid } from "../../components/ui/icons/grid";
import { IconList } from "../../components/ui/icons/list";
import { IconSearch } from "../../components/ui/icons/search";
import { Spacer } from "../../components/ui/spacer";
import { useUidb } from "../../hooks/use-uidb";
import { UidbDevice, uidbDeviceType } from "../../services/uidb";

/**
 * Splits text into parts where each occurence of search is a separate part.
 */
function splitMatches(search: string, text: string) {
  const parts: { content: string; match: boolean }[] = [];

  let remaining = text.slice();

  while (remaining.length > 0) {
    const index = remaining
      .toLocaleLowerCase()
      .indexOf(search.toLocaleLowerCase());

    if (index === -1) {
      parts.push({ content: remaining, match: false });
      break;
    }

    if (index > 0) {
      // Avoid pushing empty strings if the search is at the start of the remaining text.
      parts.push({ content: remaining.slice(0, index), match: false });
    }
    parts.push({
      content: remaining.slice(index, index + search.length),
      match: true,
    });
    remaining = remaining.slice(index + search.length);
  }

  console.log(search, text, parts);

  return parts;
}

export function Component() {
  const { data } = useUidb();
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]);
  const productLines = pipe(
    data?.devices.map((d) => d.line) ?? [],
    uniqBy((line) => line?.id),
    sortBy((line) => line?.name ?? "")
  );
  const devices =
    data?.devices.filter((device) => {
      if (selectedLineIds.length === 0) {
        return true;
      }
      return selectedLineIds.includes(device.line?.id ?? "");
    }) ?? [];
  // const totalDevices = data?.devices.length ?? 0;

  const [query, setQuery] = useState("");

  const suggestions = !query
    ? []
    : matchSorter(data?.devices ?? [], query, {
        keys: [(d) => d.product?.name ?? ""],
      }).slice(0, 10);

  const [displayType, setDisplayType] = useState("list" as "list" | "grid");

  return (
    <Container>
      <HStack className="py-4">
        <HStack className="space-x-2 relative">
          <Combobox nullable>
            <div className="relative">
              <Combobox.Input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="bg-neutral-2 rounded flex-1 h-8 pl-8 outline-primary-web-unifi-color-ublue-06 outline-1 w-72 text-sm"
              />
              <Combobox.Options className="absolute w-full rounded-b-lg bg-neutral-web-unifi-color-neutral-00 shadow-popover py-2">
                {suggestions.length === 0
                  ? "No suggestions."
                  : suggestions.map((device) => {
                      const parts = splitMatches(
                        query,
                        device.product?.name ?? ""
                      );
                      return (
                        <Combobox.Option
                          key={device.id}
                          value={device.product?.name}
                        >
                          {({ active }) => (
                            <div
                              className={cx(
                                "text-sm text-text-web-unifi-text-2 px-2 py-1.5 rounded-sm cursor-pointer border border-solid -my-px",
                                "hover:bg-neutral-web-unifi-color-neutral-02 hover:text-text-web-unifi-text-2",
                                active
                                  ? "border-primary-web-unifi-color-ublue-06"
                                  : "border-transparent"
                              )}
                            >
                              {parts.map((part) => {
                                return (
                                  <span
                                    className={
                                      part.match
                                        ? "font-bold underline"
                                        : undefined
                                    }
                                  >
                                    {part.content}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </Combobox.Option>
                      );
                    })}
              </Combobox.Options>
            </div>
          </Combobox>
          <IconSearch label="Search..." className="absolute" />
          <div className="text-xs text-gray-4">
            {devices.length ?? 0} devices
          </div>
        </HStack>

        <Spacer />
        <HStack className="space-x-2">
          <HStack>
            <Button
              isActive={displayType === "list"}
              onClick={() => setDisplayType("list")}
            >
              <IconList label="Show as list" />
            </Button>
            <Button
              isActive={displayType === "grid"}
              onClick={() => setDisplayType("grid")}
            >
              <IconGrid label="Show as grid" />
            </Button>
          </HStack>
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button isActive={!!selectedLineIds.length}>Filter</Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="start"
                className="rounded-lg bg-neutral-web-unifi-color-neutral-00 shadow-popover space-y-4 py-4"
              >
                <h4 className="text-sm font-bold px-4">Product line</h4>
                <div className="space-y-2 max-h-60 overflow-auto px-4">
                  {productLines.map((line) => {
                    const lineId = line?.id;
                    if (!lineId) {
                      return null;
                    }
                    const isChecked = selectedLineIds.some(
                      (id) => id === lineId
                    );
                    return (
                      <Checkbox
                        key={line.id}
                        checked={isChecked}
                        onChange={() =>
                          setSelectedLineIds((previouslySelected) =>
                            previouslySelected.some((id) => id === lineId)
                              ? previouslySelected.filter((id) => id !== lineId)
                              : [...previouslySelected, lineId]
                          )
                        }
                      >
                        {line?.name}
                      </Checkbox>
                    );
                  })}
                </div>
                <div className="px-4">
                  <button
                    className="text-semantic-destructive-web-unifi-color-red-06 text-sm"
                    onClick={() => setSelectedLineIds([])}
                  >
                    Reset
                  </button>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </HStack>
      </HStack>

      {displayType === "grid" ? (
        <Grid devices={devices ?? []} />
      ) : (
        <List devices={devices ?? []} />
      )}
    </Container>
  );
}

function Grid({ devices }: { devices: UidbDevice[] }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="border border-solid border-neutral-neutral-03-light rounded-lg"
          >
            <div
              style={{ height: "100px" }}
              className="bg-neutral-web-unifi-color-neutral-01 relative"
            >
              <div
                className="absolute bg-neutral-web-unifi-color-neutral-00 px-1 py-0.5 text-primary-web-unifi-color-ublue-06 text-xs flex"
                style={{ top: "3px", right: "2.6667px" }}
              >
                {device.line?.name}
              </div>
              {device.icon ? (
                <div className="p-2 flex flex-1 h-full">
                  <img
                    style={{
                      flex: 1,
                      objectFit: "scale-down",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                    src={`https://static.ui.com/fingerprint/ui/icons/${device.icon.id}_${device.icon.resolutions?.[3]?.[0]}x${device.icon.resolutions?.[3]?.[1]}.png`}
                  />
                </div>
              ) : null}
            </div>
            <div className="p-2">
              <div
                style={{ height: "40px" }}
                className="text-text-text-1-light text-sm text-ellipsis whitespace-nowrap overflow-hidden"
              >
                {device.product?.name}
              </div>
              <div className="text-text-text-3 text-xs text-ellipsis whitespace-nowrap overflow-hidden">
                {device.shortnames?.filter((s) => !!s).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function List({ devices }: { devices: UidbDevice[] }) {
  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="border-b border-solid border-neutral-neutral-03-light">
            <td />
            <th className="text-left font-bold text-sm px-2 py-0.5">
              Product Line
            </th>
            <th className="text-left font-bold text-sm px-2 py-0.5">Name</th>
          </tr>
        </thead>
        <tbody>
          {devices?.map((rawDevice) => {
            const deviceResult = uidbDeviceType.safeParse(rawDevice);
            if (!deviceResult.success) {
              return null; // TODO Handle
            }

            const device = deviceResult.data;

            return (
              <tr
                key={device.id}
                className="border-b border-solid border-neutral-neutral-03-light"
              >
                <td className="p-1.5 align-middle w-8">
                  {device.icon ? (
                    <img
                      className="h-5 w-5 inline-block"
                      src={`https://static.ui.com/fingerprint/ui/icons/${device.icon.id}_${device.icon.resolutions?.[0]?.[0]}x${device.icon.resolutions?.[0]?.[1]}.png`}
                    />
                  ) : null}
                </td>
                <td className="text-text-text-2-light text-sm px-2 py-0.5 align-middle">
                  <Link to={`/devices/${device.id}`}>{device.line?.name}</Link>
                </td>
                <td className="text-text-text-2-light text-sm px-2 py-0.5 align-middle">
                  <Link to={`/devices/${device.id}`}>
                    {device.product?.name}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
