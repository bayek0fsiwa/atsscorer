"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

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
                                <Button variant="secondary" className="w-full text-xs" disabled>
                                    View Full Details <ArrowRight className="size-3 ml-2" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
