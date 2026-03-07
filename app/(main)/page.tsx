import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Greeting } from "@/components/greeting";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const name = session?.user.name ?? "there";

  return (
    <>
      <Greeting name={name} />
      <div className="grid grid-cols-3 gap-4 mt-5">
        <Card>
          <CardHeader>
            <CardDescription className="text-center">Total Resumes Scored</CardDescription>
            <CardTitle className="text-3xl text-center">12</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-center">Average ATS Score</CardDescription>
            <CardTitle className="text-3xl text-center">74%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-center">Best Score</CardDescription>
            <CardTitle className="text-3xl text-center">91%</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex justify-center mt-6">
        <Link href="/resumes">
          <Button>Score a new resume →</Button>
        </Link>
      </div>
    </>
  );
}
