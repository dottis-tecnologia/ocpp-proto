import { z } from "zod";

const registrationStatusSchema = z.enum(["Accepted", "Pending", "Rejected"]);

export type RegistrationStatus = z.infer<typeof registrationStatusSchema>;

export default registrationStatusSchema;
