"use client";
import React from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgess: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgess,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleProgess = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgess) {
      const percentComplete = Math.round((evt.loaded / evt.total) * 100);
      onProgess(Math.round(percentComplete));
    }
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("File must be a video");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid file (jpg, png, webp)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return false;
      }
    }
    return false;
  };
  return (
    <div className="space-y-2 ">
      <IKUpload
        fileName={fileType == "video" ? "video" : "image"}
        useUniqueFileName={true}
        validateFile={validateFile}
        folder={fileType == "video" ? "/videos" : "/images"}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgess}
        onUploadStart={handleStartUpload}
        accept={fileType == "video" ? "video/*" : "image/*"}
      />
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
