import { Center } from "@chakra-ui/react";
import Station from "../components/Station";
import trpc from "../util/trpc";

export default function Default() {
  const { data, refetch } = trpc.connections.useQuery();
  trpc.onConnectionChanged.useSubscription(undefined, {
    onData() {
      refetch();
    },
  });

  if (data == null) {
    return <>No data</>;
  }

  return (
    <Center h="100vh">
      {Object.entries(data).map(([key, value]) => (
        <Station name={key} key={key} info={value || undefined} />
      ))}
    </Center>
  );
}
