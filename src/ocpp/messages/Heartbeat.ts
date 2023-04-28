import ws from "ws";

export default async function Heartbeat(_: unknown, ws: ws.WebSocket) {
  console.log("Heartbeat from", ws.identifier);
  return {
    currentTime: new Date(),
  };
}
