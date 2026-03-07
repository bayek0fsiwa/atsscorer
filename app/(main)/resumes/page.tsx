"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dropzone } from "@/components/ui/dropzone";
import { toast } from "sonner";
import { LoaderPinwheel } from "lucide-react";
import { ScoreDashboard, ScoringResult } from "@/components/ui/score-dashboard";

export default function Resume() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [scoreResult, setScoreResult] = useState<ScoringResult | null>(null);

    const handleScore = async () => {
        if (!file) {
            toast.error("Please upload a resume.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("pdfFile", file);
            formData.append("jobDescription", jobDescription);

            const response = await fetch("/api/resume", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || "Failed to parse resume.");
            }

            toast.success("Resume parsed successfully!");
            setScoreResult(data.evaluation);

        } catch (error: any) {
            toast.error(error.message || "An error occurred while scoring the resume.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setScoreResult(null);
        setFile(null);
    };

    if (scoreResult) {
        return (
            <div className="max-w-4xl mx-auto">
                <ScoreDashboard data={scoreResult} onReset={handleReset} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Heading */}
            <div>
                <h1 className="text-2xl font-semibold">Score Your Resume</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Upload your resume and optionally paste a job description to get your ATS score.
                </p>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-2 gap-4">
                {/* Left — Resume Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Resume</CardTitle>
                        <CardDescription>Upload a PDF.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dropzone
                            file={file}
                            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
                            onRemove={() => setFile(null)}
                            accept={{ "application/pdf": [".pdf"] }}
                        />
                    </CardContent>
                </Card>

                {/* Right — Job Description */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Job Description</CardTitle>
                        <CardDescription>Paste the job description to compare against (optional).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            id="job-description"
                            placeholder="Paste the job description here (optional)..."
                            className="h-52 resize-none overflow-y-auto"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            disabled={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleScore}
                    disabled={isLoading || !file}
                >
                    {isLoading && <LoaderPinwheel className="size-4 animate-spin mr-2" />}
                    Score my Resume →
                </Button>
            </div>
        </div>
    );
}
