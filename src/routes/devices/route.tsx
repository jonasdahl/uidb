import { Combobox } from "@headlessui/react";
import cx from "classnames";
import { matchSorter } from "match-sorter";
import { useState } from "react";
import { pipe, sortBy, uniqBy } from "remeda";
import { Link } from "../../components/link";
import { ProductIcon } from "../../components/product-icon";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Container } from "../../components/ui/container";
import { HStack } from "../../components/ui/h-stack";
import { IconGrid } from "../../components/ui/icons/grid";
import { IconList } from "../../components/ui/icons/list";
import { IconSearch } from "../../components/ui/icons/search";
import { Input } from "../../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Spacer } from "../../components/ui/spacer";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/ui/table";
import { useUidb } from "../../hooks/use-uidb";
import { UidbDevice } from "../../services/uidb";

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

  return parts;
}

export function Component() {
  const { data } = useUidb();
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]);

  const devices =
    data?.devices.filter((device) => {
      if (selectedLineIds.length === 0) {
        return true;
      }
      return selectedLineIds.includes(device.line?.id ?? "");
    }) ?? [];
  // const totalDevices = data?.devices.length ?? 0;

  const [displayType, setDisplayType] = useState("list" as "list" | "grid");

  return (
    <Container className="h-full flex flex-col pb-4">
      <HStack className="py-4">
        <SearchField devices={data?.devices ?? []} />

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

          <ProductLineFilter
            devices={data?.devices ?? []}
            onChangeLineIds={setSelectedLineIds}
            selectedLineIds={selectedLineIds}
          />
        </HStack>
      </HStack>

      <div className="flex-1 overflow-auto" key={displayType}>
        {displayType === "grid" ? (
          <Grid devices={devices ?? []} />
        ) : (
          <List devices={devices ?? []} />
        )}
      </div>
    </Container>
  );
}

function ProductLineFilter({
  devices,
  selectedLineIds,
  onChangeLineIds,
}: {
  devices: UidbDevice[];
  selectedLineIds: string[];
  onChangeLineIds: (newFilter: string[]) => void;
}) {
  const productLines = pipe(
    devices.map((d) => d.line) ?? [],
    uniqBy((line) => line?.id),
    sortBy((line) => line?.name ?? "")
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button isActive={!!selectedLineIds.length}>Filter</Button>
      </PopoverTrigger>
      <PopoverContent title="Product line">
        <div className="space-y-2 max-h-60 overflow-auto px-4 py-0.5">
          {productLines.map((line) => {
            const lineId = line?.id;
            if (!lineId) {
              return null;
            }
            const isChecked = selectedLineIds.some((id) => id === lineId);
            return (
              <Checkbox
                key={line.id}
                checked={isChecked}
                onChange={() =>
                  onChangeLineIds(
                    selectedLineIds.some((id) => id === lineId)
                      ? selectedLineIds.filter((id) => id !== lineId)
                      : [...selectedLineIds, lineId]
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
            className={cx(
              "text-sm",
              selectedLineIds.length === 0
                ? "text-semantic-destructive-web-unifi-color-red-03"
                : "text-semantic-destructive-web-unifi-color-red-06"
            )}
            onClick={() => onChangeLineIds([])}
          >
            Reset
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SearchField({ devices }: { devices: UidbDevice[] }) {
  const [query, setQuery] = useState("");

  const suggestions = !query
    ? []
    : matchSorter(devices, query, {
        keys: [(d) => d.product?.name ?? ""],
      }).slice(0, 10);

  return (
    <HStack className="space-x-2 relative">
      <div className="relative">
        <Combobox nullable>
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
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
              suggestions.map((device) => {
                const parts = splitMatches(query, device.product?.name ?? "");
                return (
                  <Combobox.Option key={device.id} value={device.product?.name}>
                    {({ selected, active }) => (
                      <div
                        className={cx(
                          "text-sm text-text-web-unifi-text-2 px-2 py-1.5 rounded-sm cursor-pointer border border-solid",
                          "hover:bg-neutral-web-unifi-color-neutral-02 hover:text-text-web-unifi-text-2",
                          selected || active
                            ? "border-primary-web-unifi-color-ublue-06"
                            : "border-transparent"
                        )}
                      >
                        {parts.map((part) => {
                          return (
                            <span
                              className={
                                part.match ? "font-bold underline" : undefined
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
              })
            )}
          </Combobox.Options>
        </Combobox>
      </div>
      <IconSearch label="Search..." className="absolute" />
      <div className="text-xs text-gray-4">{devices.length ?? 0} devices</div>
    </HStack>
  );
}

function Grid({ devices }: { devices: UidbDevice[] }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="border border-solid border-neutral-neutral-03-light rounded-lg relative"
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
                <Link
                  to={`/devices/${device.id}`}
                  className="before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full"
                >
                  {device.product?.name}
                </Link>
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
    <Table className="flex-1">
      <Thead>
        <Tr>
          <Th />
          <Th>Product Line</Th>
          <Th>Name</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices?.map((device) => (
          <Tr key={device.id}>
            <Td className="p-1.5 align-middle w-8">
              <ProductIcon
                icon={device.icon}
                minHeight={20}
                minWidth={20}
                fallback={null}
                className="h-5 w-5 inline-block"
              />
            </Td>
            <Td className="px-2 py-0.5">
              <Link to={`/devices/${device.id}`}>{device.line?.name}</Link>
            </Td>
            <Td className="px-2 py-0.5">
              <Link to={`/devices/${device.id}`}>{device.product?.name}</Link>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
