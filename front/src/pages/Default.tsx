import { Center, Grid, GridItem } from "@chakra-ui/react";
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
      <Grid templateColumns="repeat(3, 1fr)" gap={5}>
        {Object.entries(data).map(([key, value]) => (
          <GridItem key={key}>
            <Station name={key} info={value || undefined} />
          </GridItem>
        ))}
      </Grid>
    </Center>
  );
}
