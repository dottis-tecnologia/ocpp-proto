import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import appRouter from "./server";
import ocppServer from "./ocpp/ocpp";
import ws from "ws";

const { server, listen } = createHTTPServer({
  middleware: cors(),
  router: appRouter,
});
const wss = new ws.Server({
  server,
});
applyWSSHandler({ wss, router: appRouter });

const port = +(process.env.PORT || 3000);
listen(port);

const ocppPort = +(process.env.OCPP_PORT || 3001);
ocppServer.listen(ocppPort);
