import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Resume() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Heading */}
            <div>
                <h1 className="text-2xl font-semibold">Score Your Resume</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Upload your resume and paste the job description to get your ATS score.
                </p>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-2 gap-4">
                {/* Left — Resume Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Resume</CardTitle>
                        <CardDescription>Upload a PDF or DOCX file.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="resume" className="mb-2 block">Choose file</Label>
                        <Input id="resume" type="file" accept=".pdf,.docx" />
                    </CardContent>
                </Card>

                {/* Right — Job Description */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Job Description</CardTitle>
                        <CardDescription>Paste the job description to compare against.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            id="job-description"
                            placeholder="Paste the job description here..."
                            className="min-h-32 resize-none"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
                <Button size="lg">Score my Resume →</Button>
            </div>
        </div>
    );
}
