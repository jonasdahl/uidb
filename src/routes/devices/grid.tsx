import { Link } from "../../components/link";
import { ProductGrid, ProductGridItem } from "../../components/product-grid";
import { ProductIcon } from "../../components/product-icon";
import { UidbDevice } from "../../services/uidb";
import { useCurrentReturnToUrl } from "../../utils/return-to";

export function Grid({ devices }: { devices: UidbDevice[] }) {
  const returnTo = useCurrentReturnToUrl();

  return (
    <ProductGrid>
      {devices.map((device) => (
        <ProductGridItem
          key={device.id}
          image={
            <ProductIcon icon={device.icon} minHeight={100} minWidth={100} />
          }
          label={device.line?.name}
          title={
            <Link
              to={`/devices/${device.id}?returnTo=${returnTo}`}
              className="before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full hover:underline"
            >
              {device.product?.name}
            </Link>
          }
          description={device.shortnames?.filter((s) => !!s).join(", ")}
        />
      ))}
    </ProductGrid>
  );
}
