import { Combobox } from "@headlessui/react";
import cx from "classnames";
import { matchSorter } from "match-sorter";
import { useState } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import { pipe, sortBy, uniqBy } from "remeda";
import { z } from "zod";
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
import { UidbDevice, getUidb } from "../../services/uidb";
import { splitString } from "../../utils/split-string";
import { Grid } from "./grid";
import { List } from "./list";

const displayTypeSchema = z
  .union([z.literal("list"), z.literal("grid")])
  .optional();

export async function loader({ request }: LoaderFunctionArgs) {
  const uidb = await getUidb();
  const url = new URL(request.url);

  // Get the display type from the URL, or default to "list"
  const displayTypeResult = displayTypeSchema.safeParse(
    url.searchParams.get("displayType")
  );
  const displayType = displayTypeResult.success
    ? displayTypeResult.data
    : "list";

  // Get selected product line IDs from the URL
  const productLineIds = url.searchParams.getAll("line");

  return { uidb, displayType, productLineIds };
}

export function Component() {
  const {
    uidb,
    displayType,
    productLineIds: selectedProductLineIds,
  } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const [, setSearchParams] = useSearchParams();

  const setDisplayType = (displayType: "list" | "grid") => {
    setSearchParams(
      (previousParams) => {
        const newParams = new URLSearchParams(previousParams.toString());
        newParams.set("displayType", displayType);
        return newParams;
      },
      { replace: true }
    );
  };

  const setSelectedProductLineIds = (lineIds: string[]) => {
    setSearchParams(
      (previousParams) => {
        const newParams = new URLSearchParams(previousParams.toString());
        newParams.delete("line");
        for (const lineId of lineIds) {
          newParams.append("line", lineId);
        }
        return newParams;
      },
      { replace: true }
    );
  };

  const devices =
    uidb.devices.filter((device) => {
      if (selectedProductLineIds.length === 0) {
        return true;
      }
      return selectedProductLineIds.includes(device.line?.id ?? "");
    }) ?? [];

  const totalDevices = uidb?.devices.length ?? 0;
  const showingDevices = devices?.length ?? 0;

  return (
    <div className="flex flex-col h-full">
      <Container>
        <HStack className="py-4">
          <HStack className="space-x-2">
            <SearchField devices={devices} />
            <div className="text-xs text-gray-4">
              {totalDevices !== showingDevices
                ? `Showing ${showingDevices.toLocaleString()} of ${totalDevices.toLocaleString()} devices`
                : `${totalDevices.toLocaleString()} devices`}
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

            <ProductLineFilter
              devices={uidb.devices ?? []}
              onChangeLineIds={setSelectedProductLineIds}
              selectedLineIds={selectedProductLineIds}
            />
          </HStack>
        </HStack>
      </Container>

      <div className="flex-1 overflow-auto pb-4" key={displayType}>
        <Container className="flex">
          {displayType === "grid" ? (
            <Grid devices={devices ?? []} />
          ) : (
            <List devices={devices ?? []} />
          )}
        </Container>
      </div>
    </div>
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
                const parts = splitString(query, device.product?.name ?? "");
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
    </HStack>
  );
}
