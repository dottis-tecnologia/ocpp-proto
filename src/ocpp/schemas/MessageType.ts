import { z } from "zod";

export enum MessageType {
  CALL = 2,
  CALLRESULT = 3,
  CALLERROR = 4,
}

const messageTypeSchema = z.nativeEnum(MessageType);

export default messageTypeSchema;
