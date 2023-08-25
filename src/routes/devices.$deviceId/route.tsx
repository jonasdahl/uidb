import { ReactNode } from "react";
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
    <Container style={{ maxWidth: "768px" }}>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8"
        style={{ gridTemplateColumns: "auto 1fr" }}
      >
        <div className="bg-neutral-web-unifi-color-neutral-01 rounded-lg flex items-center flex-col p-4">
          {device.icon ? (
            <div className="w-64 h-64 flex">
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
                className="flex-1 object-scale-down max-w-full max-h-full"
              />
            </div>
          ) : null}
        </div>

        <div>
          <h1 className="text-xl font-bold">{device?.product?.name}</h1>
          <h2 className="text-text-text-3 mt-1 text-sm">
            {device?.line?.name}
          </h2>

          <DeviceProperty label="Product Line" value={device.line?.name} />
          <DeviceProperty label="ID" value={device.id} />
          <DeviceProperty label="Name" value={device.product?.name} />
          <DeviceProperty
            label="Short name"
            value={device.shortnames?.filter((s) => !!s).join(", ")}
          />
        </div>
      </div>
    </Container>
  );
}

function DeviceProperty({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <dl className="flex flex-row py-1.5 gap-5">
      <dt className="text-sm">{label}</dt>
      <dd className="text-text-text-3-light text-sm text-right flex-grow">
        {value}
      </dd>
    </dl>
  );
}
