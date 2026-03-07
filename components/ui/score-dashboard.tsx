import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, ArrowLeft, Lightbulb } from "lucide-react";

export interface ScoringResult {
    id: string;
    file_name: string;
    job_description: string;
    file_content: string;
    score: number;
    metrics: {
        matchingKeywords: string[];
        missingKeywords: string[];
        tips: string[];
    };
}

interface ScoreDashboardProps {
    data: ScoringResult;
    onReset: () => void;
}

export function ScoreDashboard({ data, onReset }: ScoreDashboardProps) {
    const isMock = data.score === 0 && data.metrics.matchingKeywords.length === 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Evaluation Results</h1>
                    <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                        <FileText className="size-4" />
                        {data.file_name}
                    </p>
                </div>
                <Button variant="outline" onClick={onReset}>
                    <ArrowLeft className="size-4 mr-2" />
                    Score Another Resume
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative size-40 mb-4 flex items-center justify-center rounded-full border-8 border-muted">
                        {isMock ? (
                            <div className="text-center px-4">
                                <span className="text-3xl font-bold text-muted-foreground">--%</span>
                            </div>
                        ) : (
                            <span className="text-4xl font-bold text-primary">{data.score}%</span>
                        )}
                        {/* 
                            For the real AI version, we can use SVG circles with strokeDasharray to create a real circular progress bar 
                        */}
                    </div>
                    <CardTitle className="text-xl">ATS Match Score</CardTitle>
                    <CardDescription className="mt-2">
                        {isMock
                            ? "AI evaluation is pending. This is a placeholder score."
                            : "Based on keyword matching and relevance to the JD."}
                    </CardDescription>
                </Card>

                {/* Details Column */}
                <div className="md:col-span-2 space-y-6">

                    {/* Raw Text Extraction Verification (Mock Version Feature) */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="size-4 text-primary" />
                                Extracted Text Verification
                            </CardTitle>
                            <CardDescription>
                                We successfully parsed your PDF. Once AI is enabled, this text will be evaluated.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted/50 p-4 rounded-md text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border">
                                {data.file_content || "No text extracted. Make sure the PDF is not an image."}
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Metrics (Hidden until AI works, but we mock it for design) */}
                    {!isMock && (
                        <>
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2 font-medium">
                                        <CheckCircle2 className="size-4 text-green-500" />
                                        Matching Keywords
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {data.metrics.matchingKeywords.map((kw, i) => (
                                        <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                                            {kw}
                                        </Badge>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2 font-medium">
                                        <XCircle className="size-4 text-red-500" />
                                        Missing Keywords
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {data.metrics.missingKeywords.map((kw, i) => (
                                        <Badge key={i} variant="secondary" className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
                                            {kw}
                                        </Badge>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Lightbulb className="size-4 text-blue-500" />
                                        Improvement Tips
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        {data.metrics.tips.map((tip, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
