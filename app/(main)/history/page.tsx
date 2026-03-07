"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface HistoryItem {
    id: string;
    file_name: string;
    job_description: string;
    score: number;
    createdAt: string;
    metrics: any;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/history");
                if (!res.ok) throw new Error("Failed to load history");
                const data = await res.json();
                setHistory(data);
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch past evaluations.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Evaluation History</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    View all your previously submitted resumes and their ATS scores.
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <LoaderPinwheel className="size-8 animate-spin text-primary" />
                </div>
            ) : history.length === 0 ? (
                <Card className="text-center py-12">
                    <CardHeader>
                        <CardTitle>No history found</CardTitle>
                        <CardDescription>You haven't evaluated any resumes yet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/resumes">Score a Resume</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => (
                        <Card key={item.id} className="flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <CardTitle className="text-base flex items-center gap-2 line-clamp-1">
                                        <FileText className="size-4 text-primary shrink-0" />
                                        <span className="truncate">{item.file_name}</span>
                                    </CardTitle>
                                    <Badge variant={item.score > 75 ? "default" : item.score > 0 ? "secondary" : "outline"} className="shrink-0">
                                        {item.score > 0 ? `${item.score}%` : "Pending AI"}
                                    </Badge>
                                </div>
                                <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                    <Calendar className="size-3" />
                                    {format(new Date(item.createdAt), "PPP")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 text-sm text-muted-foreground line-clamp-2">
                                {/* Short preview of the job description if they want to remember what it was matched against */}
                                {item.job_description || "No job description provided."}
                            </CardContent>
                            <div className="p-4 pt-0 mt-auto">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="secondary" className="w-full text-xs" disabled={item.score === 0}>
                                            View Full Details <ArrowRight className="size-3 ml-2" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle>{item.file_name}</SheetTitle>
                                            <SheetDescription>
                                                Evaluated on {format(new Date(item.createdAt), "PPP")}
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="mt-6 space-y-6">
                                            <div>
                                                <h3 className="text-lg font-semibold flex items-center gap-2 ml-2">
                                                    ATS Score
                                                    <Badge variant={item.score > 75 ? "default" : item.score > 0 ? "secondary" : "outline"}>
                                                        {item.score}%
                                                    </Badge>
                                                </h3>
                                            </div>

                                            {(item.metrics?.keywordMatches?.length > 0 || item.metrics?.matchingKeywords?.length > 0) && (
                                                <div>
                                                    <h4 className="font-medium text-sm mb-2 ml-2">Keyword Matches</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(item.metrics.keywordMatches || item.metrics.matchingKeywords).map((keyword: string, i: number) => (
                                                            <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                                                                {keyword}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {item.metrics?.missingKeywords && item.metrics.missingKeywords.length > 0 && (
                                                <div>
                                                    <h4 className="font-medium text-sm mb-2 ml-2">Missing Keywords</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.metrics.missingKeywords.map((keyword: string, i: number) => (
                                                            <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200  ml-2">
                                                                {keyword}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {(item.metrics?.improvementSuggestions?.length > 0 || item.metrics?.tips?.length > 0) && (
                                                <div>
                                                    <h4 className="font-medium text-sm mb-2 ml-2">Areas for Improvement</h4>
                                                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground ml-2">
                                                        {(item.metrics.improvementSuggestions || item.metrics.tips).map((suggestion: string, i: number) => (
                                                            <li key={i}>{suggestion}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {item.job_description && (
                                                <div>
                                                    <h4 className="font-medium text-sm mb-2 ml-2">Job Description Used</h4>
                                                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                                                        {item.job_description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
