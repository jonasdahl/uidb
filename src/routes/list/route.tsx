import { z } from "zod";
import logo from "../../assets/logo/icon.svg";
import { HStack } from "../../components/ui/hstack";
import { Spacer } from "../../components/ui/spacer";
import { Stack } from "../../components/ui/stack";
import { useUidb } from "../../hooks/use-uidb";

export function Component() {
  const { data } = useUidb();

  return (
    <Stack>
      <HStack style={{ backgroundColor: "#ccc" }}>
        <div>
          <img src={logo} />
        </div>
        <div style={{ color: "var(--text-web-unifi-text-3, #808893)" }}>
          Devices
        </div>
        <Spacer />
        <div>Jonas</div>
      </HStack>
      <table>
        <thead>
          <tr>
            <th />
            <th>Product Name</th>
            <th>Product Abbreviation</th>
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
                <td>{device.product?.name}</td>
                <td>{device.product?.abbrev}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Stack>
  );
}
