import { ReactComponent as Logo } from "../../assets/logo.svg";
import { Link } from "../link";
import { HStack } from "../ui/h-stack";
import { Spacer } from "../ui/spacer";

export function TopBar() {
  return (
    <HStack className="bg-neutral-web-unifi-color-neutral-02 text-web-unifi-text-3 pr-8 space-x-2">
      <Link
        to="/"
        className="block border border-solid border-transparent focus:border-primary-web-unifi-color-ublue-06 outline-none text-text-web-unifi-text-2 hover:text-primary-web-unifi-color-ublue-06"
        style={{ padding: "5px" }}
      >
        <Logo />
      </Link>

      <Link
        className="text-text-web-unifi-text-3 text-sm h-full inline-flex flex-row items-center focus:outline outline-1 outline-primary-web-unifi-color-ublue-06 -outline-offset-1 px-0.5"
        to="/"
      >
        Devices
      </Link>

      <Spacer />

      <div className="text-text-web-unifi-text-3 text-sm">Jonas Dahl</div>
    </HStack>
  );
}
