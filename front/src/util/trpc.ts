import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../../appRouter";

const trpc = createTRPCReact<AppRouter>();
export default trpc;
