import { NextResponse } from "next/server";
import PDFParser from "pdf2json";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { resumeEvaluation } from "@/db/schema/resume-evaluations-schema";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const pdfFile = formData.get("pdfFile") as File | null;
        const jobDescription = formData.get("jobDescription") as string;

        if (!pdfFile || typeof pdfFile === "string" || !jobDescription) {
            return NextResponse.json(
                { error: "Please provide a valid PDF file and Job Description." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await pdfFile.arrayBuffer());

        const extractedText = await new Promise<string>((resolve, reject) => {
            // `true` skips layout mapping (we just want raw text)
            const pdfParser = new PDFParser(null, true);

            pdfParser.on("pdfParser_dataError", (errData) => {
                reject("parserError" in errData ? errData.parserError : errData);
            });

            pdfParser.on("pdfParser_dataReady", () => {
                resolve(pdfParser.getRawTextContent());
            });

            pdfParser.parseBuffer(buffer);
        });

        // Save to Database (Mock AI Score for now)
        const [savedEvaluation] = await db.insert(resumeEvaluation).values({
            userId: session.user.id,
            file_name: pdfFile.name,
            file_content: extractedText,
            job_description: jobDescription,
            score: 0, // Mock score until AI is ready
            metrics: {
                matchingKeywords: [],
                missingKeywords: [],
                tips: []
            }
        }).returning();

        return NextResponse.json({
            message: "File parsed and saved successfully",
            evaluation: savedEvaluation
        });

    } catch (error: any) {
        console.error("PDF Parsing Error:", error);
        return NextResponse.json({
            error: "Failed to parse PDF",
            details: error?.message || String(error)
        }, { status: 500 });
    }
}