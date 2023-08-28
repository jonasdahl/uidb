import cx from "classnames";
import { ComponentProps, ReactNode, useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { z } from "zod";
import { Link } from "../../components/link";
import { ProductIcon } from "../../components/product-icon";
import { Code } from "../../components/ui/code";
import { Container } from "../../components/ui/container";
import { IconChevronLeft } from "../../components/ui/icons/chevron-left";
import { IconChevronRight } from "../../components/ui/icons/chevron-right";
import { Spacer } from "../../components/ui/spacer";
import { useReturnToUrl } from "../../utils/return-to";
import { getUidb } from "../../utils/uidb";

// React router will run this every page load/client side navigation.
// This loads uidb and parses some data from the URL that we need.
// In the future, this should be able to run on the server instead,
// with something like Remix or Next.js.
export async function loader({ params }: LoaderFunctionArgs) {
  const uidb = await getUidb();
  const deviceIndex = uidb?.devices.findIndex((d) => {
    const parsed = z.object({ id: z.string() }).safeParse(d);
    if (!parsed.success) {
      return false;
    }
    return parsed.data.id === params.deviceId;
  });
  const device = uidb?.devices[deviceIndex];

  if (!device) {
    throw new Response("Not found", { status: 404 });
  }

  const nextDeviceId = uidb?.devices[deviceIndex + 1]?.id;
  const previousDeviceId = uidb?.devices[deviceIndex - 1]?.id;

  return { device, previousDeviceId, nextDeviceId };
}

export function Component() {
  const { device, nextDeviceId, previousDeviceId } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  const [showAllDetails, setShowAllDetails] = useState(false);

  const backUrl = useReturnToUrl();

  return (
    <div>
      <div className="py-0.5">
        <div className="px-8 py-4 flex flex-row gap-1">
          <NavLink
            to={backUrl ?? "/"}
            icon={<IconChevronLeft label="Go back" />}
            label="Back"
          />

          <Spacer />

          {previousDeviceId ? (
            <NavLink
              to={`/devices/${previousDeviceId}?returnTo=${backUrl}`}
              icon={<IconChevronLeft label="Previous" />}
            />
          ) : null}
          {nextDeviceId ? (
            <NavLink
              to={`/devices/${nextDeviceId}?returnTo=${backUrl}`}
              icon={<IconChevronRight label="Next" />}
            />
          ) : null}
        </div>
      </div>
      <Container style={{ maxWidth: "768px" }} className="pb-10">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-8"
          style={{ gridTemplateColumns: "auto 1fr" }}
        >
          <div className="bg-neutral-web-unifi-color-neutral-01 rounded-lg flex items-center flex-col p-4">
            {device.icon ? (
              <div className="w-64 h-64 flex">
                <ProductIcon
                  icon={device.icon}
                  fallback={null}
                  minWidth={256}
                  minHeight={256}
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

        <div className="flex flex-col items-center">
          <CTA onClick={() => setShowAllDetails((old) => !old)}>
            See All Details as JSON
          </CTA>
        </div>

        {showAllDetails ? <Code>{JSON.stringify(device, null, 2)}</Code> : null}
      </Container>
    </div>
  );
}

function NavLink({
  icon,
  label,
  to,
}: {
  icon?: ReactNode;
  label?: ReactNode;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="bg-neutral-web-unifi-color-neutral-00 shadow-low-light text-text-text-3 p-1 text-sm flex flex-row rounded"
    >
      {icon ? (
        <span
          style={{ display: "inline-block", padding: "4px 7px" }}
          className="text-neutral-neutral-08-light"
        >
          {icon}
        </span>
      ) : null}
      {label ? <span>{label}</span> : null}
    </Link>
  );
}

function CTA(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={cx(
        "text-primary-web-unifi-color-ublue-06 text-sm",
        "hover:text-primary-web-unifi-color-ublue-07",
        "border border-transparent outline-none",
        "py-1.5 px-0.5",
        "rounded",
        "focus:border-primary-web-unifi-color-ublue-06",
        props.className
      )}
    />
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
