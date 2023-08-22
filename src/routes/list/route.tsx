import { z } from "zod";
import { HStack } from "../../components/ui/hstack";
import { Spacer } from "../../components/ui/spacer";
import { Stack } from "../../components/ui/stack";
import { useUidb } from "../../hooks/use-uidb";

export function Component() {
  const { data } = useUidb();

  return (
    <Stack>
      <HStack style={{ backgroundColor: "#ccc" }}>
        <div>Index</div>
        <Spacer />
        <div>Jonas</div>
      </HStack>
      <table>
        <thead>
          <tr>
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
              })
              .safeParse(rawDevice);
            if (!deviceResult.success) {
              return (
                <tr>
                  <td>error</td>
                  <td />
                </tr>
              );
            }

            const device = deviceResult.data;

            return (
              <tr key={device.id}>
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
