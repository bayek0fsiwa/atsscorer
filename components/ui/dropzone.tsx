import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { cn } from "@/lib/utils";
import { UploadCloud, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
    onDrop: (acceptedFiles: File[]) => void;
    file: File | null;
    onRemove: () => void;
    className?: string;
}

export function Dropzone({
    onDrop,
    file,
    onRemove,
    className,
    ...props
}: DropzoneProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        ...props,
    });

    if (file) {
        return (
            <div
                className={cn(
                    "flex items-center justify-between p-4 border rounded-md bg-muted/50",
                    className
                )}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-primary/10 rounded-full shrink-0">
                        <FileText className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    aria-label="Remove file"
                >
                    <X className="size-4" />
                </Button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="p-3 bg-primary/10 rounded-full mb-4">
                <UploadCloud className="size-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-center mb-1">
                Click or drag file to this area to upload
            </p>
            <p className="text-xs text-muted-foreground text-center">
                Supported formats: PDF, DOCX (Max 5MB)
            </p>
        </div>
    );
}
