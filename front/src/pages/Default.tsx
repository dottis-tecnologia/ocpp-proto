import trpc from "../util/trpc";

export default function Default() {
  const ping = trpc.ping.useQuery();

  return <>{ping.data}</>;
}
