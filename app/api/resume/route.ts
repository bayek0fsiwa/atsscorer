import { NextResponse } from "next/server";
import PDFParser from "pdf2json";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { resumeEvaluation } from "@/db/schema/resume-evaluations-schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const resultSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.INTEGER,
            description: "The ATS compatibility score of the resume out of 100",
        },
        matchingKeywords: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "Keywords from the job description that were found in the resume",
        },
        missingKeywords: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "Important keywords from the job description that are missing in the resume",
        },
        tips: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "Actionable tips and areas of improvement for the resume",
        },
    },
    required: ["score", "matchingKeywords", "missingKeywords", "tips"],
};

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
        const jobDescription = formData.get("jobDescription") as string || "";

        if (!pdfFile || typeof pdfFile === "string") {
            return NextResponse.json(
                { error: "Please provide a valid PDF file." },
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

        // Evaluate Resume against Job Description using Gemini
        const currentDate = new Date().toISOString().split('T')[0];
        const prompt = `You are an expert ATS (Applicant Tracking System).
Evaluate this resume against the provided job description and if no job description is provided, evaluate it against a generic job description for the role mentioned in the resume.
Be strict and objective.

Today's date is: ${currentDate}. Keep this context in mind if dates are mentioned in the resume.

Job Description:
${jobDescription}

Resume:
${extractedText}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resultSchema,
            },
        });

        const evaluationResult = JSON.parse(response.text || "{}");

        // Save to Database
        const [savedEvaluation] = await db.insert(resumeEvaluation).values({
            userId: session.user.id,
            file_name: pdfFile.name,
            file_content: extractedText,
            job_description: jobDescription,
            score: evaluationResult.score || 0,
            metrics: {
                matchingKeywords: evaluationResult.matchingKeywords || [],
                missingKeywords: evaluationResult.missingKeywords || [],
                tips: evaluationResult.tips || []
            }
        }).returning();

        return NextResponse.json({
            message: "File evaluated successfully",
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