import { observable } from "@trpc/server/observable";
import connections from "./ocpp/connections";
import { publicProcedure, router } from "./trpc";
import { EventEmitter } from "events";
import { z } from "zod";

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
  onHeartbeat: publicProcedure.input(z.string()).subscription(({ input }) =>
    observable<Date>((emit) => {
      const onHeartbeat = (id: string, date: Date) => {
        if (id === input) {
          emit.next(date);
        }
      };

      ee.on("heartbeat", onHeartbeat);
      return () => {
        ee.off("heartbeat", onHeartbeat);
      };
    })
  ),
});

export type AppRouter = typeof appRouter;

export default appRouter;
