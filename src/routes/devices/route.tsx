import { z } from "zod";
import gridIcon from "../../assets/grid.svg";
import listIcon from "../../assets/list.svg";
import { Container } from "../../components/ui/container";
import { HStack } from "../../components/ui/hstack";
import { Spacer } from "../../components/ui/spacer";
import { useUidb } from "../../hooks/use-uidb";

export function Component() {
  const { data } = useUidb();

  return (
    <Container>
      <HStack className="py-4">
        <HStack className="space-x-2">
          <input placeholder="Search..." className="bg-neutral-2 rounded" />
          <div>{data?.devices.length ?? 0} devices</div>
        </HStack>

        <Spacer />
        <HStack className="space-x-2">
          <button className="p-2">
            <img src={listIcon} />
          </button>
          <button className="p-2">
            <img src={gridIcon} />
          </button>
          <div>Filter</div>
        </HStack>
      </HStack>

      <table>
        <thead>
          <tr>
            <td />
            <th className="text-left font-bold">Product Line</th>
            <th className="text-left font-bold">Name</th>
          </tr>
        </thead>
        <tbody>
          {data?.devices.map((rawDevice) => {
            const deviceResult = z
              .object({
                id: z.string().optional().nullable(),
                product: z
                  .object({
                    abbrev: z.string().optional().nullable(),
                    name: z.string().optional().nullable(),
                  })
                  .optional()
                  .nullable(),
                icon: z
                  .object({
                    resolutions: z.array(z.tuple([z.number(), z.number()])),
                    id: z.string(),
                  })
                  .optional()
                  .nullable(),
                line: z
                  .object({
                    name: z.string().optional().nullable(),
                    id: z.string().optional().nullable(),
                  })
                  .optional()
                  .nullable(),
              })
              .safeParse(rawDevice);
            if (!deviceResult.success) {
              return (
                <tr>
                  <td />
                  <td>error</td>
                  <td />
                </tr>
              );
            }

            const device = deviceResult.data;

            return (
              <tr key={device.id}>
                <td>
                  {device.icon ? (
                    <img
                      src={`https://static.ui.com/fingerprint/ui/icons/${device.icon.id}_${device.icon.resolutions?.[0]?.[0]}x${device.icon.resolutions?.[0]?.[1]}.png`}
                    />
                  ) : null}
                </td>
                <td>{device.line?.name}</td>
                <td>{device.product?.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}
