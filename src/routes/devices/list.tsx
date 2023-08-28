import { Link } from "../../components/link";
import { ProductIcon } from "../../components/product-icon";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/ui/table";
import { UidbDevice } from "../../services/uidb";

export function List({ devices }: { devices: UidbDevice[] }) {
  return (
    <Table className="flex-1">
      <Thead>
        <Tr>
          <Th />
          <Th className="whitespace-nowrap">Product Line</Th>
          <Th>Name</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices?.map((device) => (
          <Tr key={device.id}>
            <Td className="p-1.5 align-middle w-8">
              <ProductIcon
                icon={device.icon}
                minHeight={20}
                minWidth={20}
                fallback={null}
                className="h-5 w-5 inline-block"
              />
            </Td>
            <Td className="px-2 py-0.5">
              <Link to={`/devices/${device.id}`}>{device.line?.name}</Link>
            </Td>
            <Td className="px-2 py-0.5">
              <Link to={`/devices/${device.id}`}>{device.product?.name}</Link>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
