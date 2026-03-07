import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Greeting } from "@/components/greeting";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const name = session?.user.name ?? "there";

  return (
    <>
      <Greeting name={name} />
    </>
  );
}
