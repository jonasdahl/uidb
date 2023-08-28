import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { pipe, sortBy, uniqBy } from "remeda";
import { z } from "zod";
import { ActionButton } from "../../components/ui/action-button";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Container } from "../../components/ui/container";
import { HStack } from "../../components/ui/h-stack";
import { IconGrid } from "../../components/ui/icons/grid";
import { IconList } from "../../components/ui/icons/list";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTitle,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  SearchInput,
  SearchInputSuggestion,
} from "../../components/ui/search-input";
import { Spacer } from "../../components/ui/spacer";
import { useCurrentReturnToUrl } from "../../utils/return-to";
import { UidbDevice, getUidb } from "../../utils/uidb";
import { Grid } from "./grid";
import { List } from "./list";

const displayTypeSchema = z
  .union([z.literal("list"), z.literal("grid")])
  .optional();

// React router will run this loader function on every page load/navigation.
// This loads uidb and parses some data from the URL that we need.
// In the future, this should be able to run on the server instead,
// with something like Remix or Next.js.
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
            <div className="text-xs text-gray-4 whitespace-nowrap overflow-hidden text-ellipsis flex-shrink hidden sm:block">
              {totalDevices !== showingDevices
                ? `Showing ${showingDevices.toLocaleString()} of ${totalDevices.toLocaleString()} devices`
                : `${totalDevices.toLocaleString()} devices`}
            </div>
          </HStack>

          <Spacer />

          <HStack className="space-x-2">
            <HStack>
              <ActionButton
                isActive={displayType === "list"}
                onClick={() => setDisplayType("list")}
              >
                <IconList label="Show as list" />
              </ActionButton>

              <ActionButton
                isActive={displayType === "grid"}
                onClick={() => setDisplayType("grid")}
              >
                <IconGrid label="Show as grid" />
              </ActionButton>
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
        <ActionButton isActive={!!selectedLineIds.length}>Filter</ActionButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Product line</PopoverTitle>
        <PopoverBody>
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
        </PopoverBody>

        <PopoverFooter>
          <Button
            className={
              selectedLineIds.length === 0
                ? "text-semantic-destructive-web-unifi-color-red-03"
                : "text-semantic-destructive-web-unifi-color-red-06"
            }
            onClick={() => onChangeLineIds([])}
          >
            Reset
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

function SearchField({ devices }: { devices: UidbDevice[] }) {
  const returnTo = useCurrentReturnToUrl();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    if (!query) {
      return [];
    }
    const matches = matchSorter(devices, query, {
      keys: [(d) => d.product?.name ?? "", (d) => d.line?.name ?? ""],
    });
    return matches.slice(0, 10);
  }, [devices, query]);

  return (
    <SearchInput
      onChange={setQuery}
      suggestions={suggestions}
      onSelect={(deviceId) => {
        if (deviceId) {
          navigate(`/devices/${deviceId}?returnTo=${returnTo}`);
        }
      }}
      renderSuggestion={(device, { selected, active }) => {
        return (
          <SearchInputSuggestion
            active={active}
            selected={selected}
            label={device.product?.name ?? ""}
            searchString={query}
          />
        );
      }}
    />
  );
}
