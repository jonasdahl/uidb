import { HStack } from "../../components/ui/hstack";
import { Spacer } from "../../components/ui/spacer";
import { Stack } from "../../components/ui/stack";

export function Component() {
  return (
    <Stack>
      <HStack style={{ backgroundColor: "#ccc" }}>
        <div>Hej</div>
        <Spacer />
        <div>Hej</div>
      </HStack>
    </Stack>
  );
}
