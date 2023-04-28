import ws from "ws";
import BootNotification from "./messages/BootNotification";
import callMessageSchema, { CallError, CallResult } from "./schemas/Call";
import { MessageType } from "./schemas/MessageType";
import Heartbeat from "./messages/Heartbeat";
import connections from "./connections";

declare module "ws" {
  interface WebSocket {
    identifier: string;
  }
}

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
  });
});

export default ocpp;
