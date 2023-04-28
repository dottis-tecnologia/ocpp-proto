import ws from "ws";
import RegistrationStatus from "../schemas/RegistrationStatus";
import { z } from "zod";
import connections from "../connections";

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

  return {
    currentType: new Date(),
    interval: 6000,
    status: RegistrationStatus.Values.Accepted,
  };
}
