import logo from "../../assets/logo.svg";
import { HStack } from "../ui/hstack";
import { Spacer } from "../ui/spacer";

export function TopBar() {
  return (
    <HStack
      className="bg-neutral-web-unifi-color-neutral-02 text-web-unifi-text-3"
      style={{ height: "50px" }}
    >
      <div>
        <img src={logo} className="h-10 w-10" />
      </div>
      <div style={{ color: "var(--text-web-unifi-text-3, #808893)" }}>
        Devices
      </div>
      <Spacer />
      <div>Jonas</div>
    </HStack>
  );
}
