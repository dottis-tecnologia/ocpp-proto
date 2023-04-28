import { publicProcedure, router } from "./trpc";

const appRouter = router({
  ping: publicProcedure.query(() => "pong"),
});

export type AppRouter = typeof appRouter;

export default appRouter;
