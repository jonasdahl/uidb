import logo from "../../assets/logo.svg";
import { Link } from "../link";
import { HStack } from "../ui/hstack";
import { Spacer } from "../ui/spacer";

export function TopBar() {
  return (
    <HStack className="bg-neutral-web-unifi-color-neutral-02 text-web-unifi-text-3 pr-8 space-x-2">
      <div className="p-1">
        <Link to="/">
          <div style={{ padding: "1px" }}>
            <img src={logo} className="h-10 w-10" />
          </div>
        </Link>
      </div>
      <Link className="text-text-web-unifi-text-3 text-sm h-full block" to="/">
        Devices
      </Link>
      <Spacer />
      <div className="text-text-web-unifi-text-3 text-sm">Jonas</div>
    </HStack>
  );
}
