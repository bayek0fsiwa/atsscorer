import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Greeting } from "@/components/greeting";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { resumeEvaluation } from "@/db/schema/resume-evaluations-schema";
import { eq, desc } from "drizzle-orm";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return null;
  }

  const name = session.user.name ?? "there";

  const evaluations = await db
    .select()
    .from(resumeEvaluation)
    .where(eq(resumeEvaluation.userId, session.user.id))
    .orderBy(desc(resumeEvaluation.createdAt));

  const totalResumes = evaluations.length;
  const averageScore = totalResumes > 0 ? Math.round(evaluations.reduce((acc, curr) => acc + curr.score, 0) / totalResumes) : 0;
  const bestScore = totalResumes > 0 ? Math.max(...evaluations.map(e => e.score)) : 0;

  return (
    <>
      <Greeting name={name} />
      <div className="grid grid-cols-3 gap-4 mt-5">
        <Card>
          <CardHeader>
            <CardDescription className="text-center">Total Resumes Scored</CardDescription>
            <CardTitle className="text-3xl text-center">{totalResumes}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-center">Average ATS Score</CardDescription>
            <CardTitle className="text-3xl text-center">{averageScore}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-center">Best Score</CardDescription>
            <CardTitle className="text-3xl text-center">{bestScore}%</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex justify-center mt-6">
        <Link href="/resumes">
          <Button>Score a new resume →</Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Resumes</h2>
        {evaluations.length === 0 ? (
          <p className="text-muted-foreground text-center py-10 border rounded-lg bg-card text-card-foreground">
            You haven't scored any resumes yet. Click the button above to get started.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground hover:bg-accent transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-lg truncate max-w-[300px] sm:max-w-[400px]" title={evaluation.file_name}>
                    {evaluation.file_name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(evaluation.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-xl font-bold">{evaluation.score}%</span>
                    <span className="text-xs text-muted-foreground">ATS Score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
