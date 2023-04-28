import { z } from "zod";
import { MessageType } from "./MessageType";

const callMessageSchema = z.tuple([
  z.literal(MessageType.CALL),
  z.coerce.string(),
  z.string(),
  z.unknown(),
]);

export type CallMessage = z.infer<typeof callMessageSchema>;
export default callMessageSchema;

export type CallResult<T> = [
  MessageType.CALLRESULT,
  string, // Id
  T // payload
];

export type ErrorCode =
  | "NotImplemented"
  | "NotSupported"
  | "InternalError"
  | "ProtocolError"
  | "SecurityError"
  | "FormationViolation"
  | "PropertyConstraintViolation"
  | "OccurenceConstraintViolation"
  | "TypeConstraintViolation"
  | "GenericError";

export type CallError = [
  MessageType.CALLERROR,
  string, // Id
  ErrorCode,
  string, // ErrorString
  object?
];
