import { useState } from "react";
import { ReactComponent as Icon } from "../assets/charging-station-solid.svg";
import { Box, Heading } from "@chakra-ui/react";
import trpc from "../util/trpc";

export type StationProps = {
  name: string;
  info: {
    chargePointModel: string;
    chargePointVendor: string;
  };
};

export default function Station({ name, info }: StationProps) {
  const [lastHeartbeat, setLastHeartbeat] = useState<Date>();
  trpc.onHeartbeat.useSubscription(name, {
    onData(date) {
      console.log(date);
    },
  });

  return (
    <>
      <Box p={3} textAlign={"center"}>
        <Icon />
        <Heading>{name}</Heading>
        {info.chargePointModel}
        <br />
        {info.chargePointVendor}
      </Box>
    </>
  );
}
