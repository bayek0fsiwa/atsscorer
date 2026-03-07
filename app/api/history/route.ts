import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { resumeEvaluation } from "@/db/schema/resume-evaluations-schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const evaluations = await db
            .select()
            .from(resumeEvaluation)
            .where(eq(resumeEvaluation.userId, session.user.id))
            .orderBy(desc(resumeEvaluation.createdAt));

        return NextResponse.json(evaluations);

    } catch (error: any) {
        console.error("Failed to fetch history:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching your history." },
            { status: 500 }
        );
    }
}
