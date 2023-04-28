import { observable } from "@trpc/server/observable";
import connections, { Connection } from "./ocpp/connections";
import { publicProcedure, router } from "./trpc";
import { EventEmitter } from "events";

export const ee = new EventEmitter();

type Connections = typeof connections;

const appRouter = router({
  ping: publicProcedure.query(() => "pong"),
  connections: publicProcedure.query(() => connections),
  onConnectionChanged: publicProcedure.subscription(() =>
    observable<Connections>((emit) => {
      const onConnectionChanged = () => {
        emit.next(connections);
      };

      ee.on("connectionsChanged", onConnectionChanged);
      return () => {
        ee.off("connectionsChanged", onConnectionChanged);
      };
    })
  ),
});

export type AppRouter = typeof appRouter;

export default appRouter;
