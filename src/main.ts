import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import appRouter, { AppRouter } from "./server";
import ocpp from "./ocpp/ocpp";
import { parse } from "url";

const { server, listen } = createHTTPServer({
  middleware: cors(),
  router: appRouter,
});

server.on("upgrade", (request, socket, head) => {
  if (request.url == null) return socket.destroy();

  const { pathname } = parse(request.url);
  const match = pathname?.match(/\/webServices\/ocpp\/(.*)/);

  if (match) {
    ocpp.handleUpgrade(request, socket, head, (ws) => {
      ocpp.emit("connection", ws, { identity: match[1] });
    });
  } else {
    socket.destroy();
  }
});

listen(3000);
