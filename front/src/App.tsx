import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import trpc from "./util/trpc";
import { httpBatchLink } from "@trpc/client";
import Default from "./pages/Default";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
    }),
  ],
});

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Default />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
