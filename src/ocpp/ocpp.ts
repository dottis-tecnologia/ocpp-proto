import ws from "ws";
import BootNotification from "./messages/BootNotification";
import callMessageSchema, { CallError, CallResult } from "./schemas/Call";
import { MessageType } from "./schemas/MessageType";
import Heartbeat from "./messages/Heartbeat";
import connections from "./connections";
import { ee } from "../server";
import { parse } from "url";
import { createServer } from "http";

declare module "ws" {
  interface WebSocket {
    identifier: string;
  }
}

const ocppServer = createServer();
const ocpp = new ws.Server({ noServer: true });

const handlers: Record<
  string,
  (data: unknown, ws: ws.WebSocket) => unknown | Promise<unknown>
> = {
  BootNotification,
  Heartbeat,
};

ocpp.on("connection", (ws, req: { identity: string }) => {
  ws.identifier = req.identity;

  ws.on("message", async (rawData) => {
    const [, id, method, payload] = callMessageSchema.parse(
      JSON.parse(rawData.toString())
    );

    const handler = handlers[method];
    if (handler == null) {
      // catch all
      const resp: CallError = [
        MessageType.CALLERROR,
        id,
        "NotSupported",
        "Method not implemented",
      ];
      ws.send(JSON.stringify(resp));
      console.log(method, "not implemented");
      return;
    }

    const respPayload = await handler(payload, ws);
    const resp: CallResult<unknown> = [MessageType.CALLRESULT, id, respPayload];
    ws.send(JSON.stringify(resp));
  });

  ws.on("close", () => {
    delete connections[ws.identifier];
    ee.emit("connectionsChanged");
  });
});

ocppServer.on("upgrade", (request, socket, head) => {
  if (request.url == null) return socket.destroy();

  const { pathname } = parse(request.url);
  const match = pathname?.match(/\/webServices\/ocpp\/(.*)/);

  if (match == null) {
    return socket.destroy();
  }

  ocpp.handleUpgrade(request, socket, head, (ws) => {
    ocpp.emit("connection", ws, { identity: match[1] });
  });
});

export default ocppServer;
