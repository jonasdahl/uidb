import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { z } from "zod";
import { Container } from "../../components/ui/container";
import { getUidb, uidbDeviceType } from "../../services/uidb";

export async function loader({ params }: LoaderFunctionArgs) {
  const uidb = await getUidb();
  const device = uidb?.devices.find((d) => {
    const parsed = z.object({ id: z.string() }).safeParse(d);
    if (!parsed.success) {
      return false;
    }
    return parsed.data.id === params.deviceId;
  });

  if (!device) {
    throw new Response("Not found", { status: 404 });
  }

  const parsed = uidbDeviceType.safeParse(device);

  if (!parsed.success) {
    throw new Response("Failed to load device data", { status: 500 });
  }

  return { device: parsed.data };
}

export function Component() {
  const { device } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div className="bg-neutral-web-unifi-color-neutral-01">
          {device.icon ? (
            <img
              src={`https://static.ui.com/fingerprint/ui/icons/${
                device.icon.id
              }_${
                device.icon.resolutions?.[
                  device.icon.resolutions.length - 1
                ]?.[0]
              }x${
                device.icon.resolutions?.[
                  device.icon.resolutions.length - 1
                ]?.[1]
              }.png`}
            />
          ) : null}
        </div>

        <div>
          <h1 className="text-xl">{device?.product?.name}</h1>
          <h2 className="text-text-text-3">{device?.line?.name}</h2>
        </div>
      </div>
    </Container>
  );
}
