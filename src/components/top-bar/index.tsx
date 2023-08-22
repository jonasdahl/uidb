import logo from "../../assets/logo/icon.svg";
import { HStack } from "../ui/hstack";
import { Spacer } from "../ui/spacer";

export function TopBar() {
  return (
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
  );
}
