import { Center, Grid, GridItem, Text } from "@chakra-ui/react";
import Station from "../components/Station";
import trpc from "../util/trpc";

export default function Default() {
  const { data, refetch, isLoading } = trpc.connections.useQuery();
  trpc.onConnectionChanged.useSubscription(undefined, {
    onData() {
      refetch();
    },
  });

  return (
    <Center h="100vh">
      {data ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={5}>
          {Object.entries(data).map(([key, value]) => (
            <GridItem key={key}>
              <Station name={key} info={value || undefined} />
            </GridItem>
          ))}
        </Grid>
      ) : isLoading ? (
        <Text>Carregando...</Text>
      ) : (
        <Text>Nada a exibir</Text>
      )}
    </Center>
  );
}
