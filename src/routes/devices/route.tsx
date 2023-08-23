import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { pipe, sortBy, uniqBy } from "remeda";
import gridIcon from "../../assets/grid.svg";
import listIcon from "../../assets/list.svg";
import searchIcon from "../../assets/search.svg";
import { Link } from "../../components/link";
import { Checkbox } from "../../components/ui/checkbox";
import { Container } from "../../components/ui/container";
import { HStack } from "../../components/ui/hstack";
import { Spacer } from "../../components/ui/spacer";
import { useUidb } from "../../hooks/use-uidb";
import { uidbDeviceType } from "../../services/uidb";

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
  const totalDevices = data?.devices.length ?? 0;

  return (
    <Container>
      <HStack className="py-4">
        <HStack className="space-x-2 relative">
          <img src={searchIcon} className="absolute left-4" />
          <input
            placeholder="Search..."
            className="bg-neutral-2 rounded flex-1 h-8 pl-8 outline-primary-web-unifi-color-ublue-06 outline-1 w-72"
          />
          <div className="text-xs text-gray-4">
            {devices.length ?? 0} devices
          </div>
        </HStack>

        <Spacer />
        <HStack className="space-x-2">
          <button style={{ padding: "6px" }}>
            <img src={listIcon} />
          </button>
          <button style={{ padding: "6px" }}>
            <img src={gridIcon} />
          </button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="text-sm text-text-text-3">Filter</button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content asChild align="start">
                <div className="p-4 rounded-lg bg-neutral-web-unifi-color-neutral-00 shadow-popover space-y-4">
                  <h4 className="text-sm font-bold">Product line</h4>
                  <div className="space-y-2 max-h-80 overflow-auto">
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
                          checked={isChecked}
                          onChange={() =>
                            setSelectedLineIds((previouslySelected) =>
                              previouslySelected.some((id) => id === lineId)
                                ? previouslySelected.filter(
                                    (id) => id !== lineId
                                  )
                                : [...previouslySelected, lineId]
                            )
                          }
                        >
                          {line?.name}
                        </Checkbox>
                      );
                    })}
                  </div>
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
    </Container>
  );
}
