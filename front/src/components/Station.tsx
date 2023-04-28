import { useState } from "react";
import { ReactComponent as Icon } from "../assets/charging-station-solid.svg";
import { Box, HStack, Heading, Text } from "@chakra-ui/react";
import trpc from "../util/trpc";

export type StationProps = {
  name: string;
  info: {
    chargePointModel: string;
    chargePointVendor: string;
  };
};

export default function Station({ name, info }: StationProps) {
  const [lastHeartbeat, setLastHeartbeat] = useState<Date>(new Date());

  trpc.onHeartbeat.useSubscription(name, {
    onData(date) {
      setLastHeartbeat(new Date(date));
    },
  });

  return (
    <Box>
      <HStack gap={3} mb={1} p={3}>
        <Box w="32">
          <Icon />
        </Box>
        <Box>
          <Heading>{name}</Heading>
          <Text>
            {info.chargePointModel}
            <br />
            {info.chargePointVendor}
          </Text>
        </Box>
      </HStack>
      <Text textAlign={"center"}>
        Última atualização: {lastHeartbeat.toLocaleTimeString()}
      </Text>
    </Box>
  );
}
