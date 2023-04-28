import ws from "ws";
import { ee } from "../../server";

export default async function Heartbeat(_: unknown, ws: ws.WebSocket) {
  const currentTime = new Date();
  ee.emit("heartbeat", ws.identifier, currentTime);

  return {
    currentTime,
  };
}
