import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import trpc from "./util/trpc";
import { createWSClient, httpLink, splitLink, wsLink } from "@trpc/client";
import Default from "./pages/Default";
import { ChakraProvider } from "@chakra-ui/react";

const wsClient = createWSClient({
  url: `ws://159.89.179.153:8970`,
});
const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpLink({
        url: `http://159.89.179.153:8970`,
      }),
    }),
  ],
});

function App() {
  return (
    <ChakraProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Default />
        </QueryClientProvider>
      </trpc.Provider>
    </ChakraProvider>
  );
}

export default App;
