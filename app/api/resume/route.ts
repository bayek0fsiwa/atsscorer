import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const pdfFile = formData.get("pdfFile");

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

        return NextResponse.json({
            message: "File parsed successfully",
            extractedText
        });

    } catch (error: any) {
        console.error("PDF Parsing Error:", error);
        return NextResponse.json({
            error: "Failed to parse PDF",
            details: error?.message || String(error)
        }, { status: 500 });
    }
}