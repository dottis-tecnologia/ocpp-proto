import ws from "ws";
import RegistrationStatus from "../schemas/RegistrationStatus";
import { z } from "zod";
import connections from "../connections";
import { ee } from "../../server";

const bootNotificationSchema = z.object({
  chargePointModel: z.string(),
  chargePointVendor: z.string(),
});

export default async function BootNotification(
  data: unknown,
  ws: ws.WebSocket
) {
  const payload = bootNotificationSchema.parse(data);
  connections[ws.identifier] = payload;
  ee.emit("connectionsChanged");

  return {
    currentType: new Date(),
    interval: 6000,
    status: RegistrationStatus.Values.Accepted,
  };
}
