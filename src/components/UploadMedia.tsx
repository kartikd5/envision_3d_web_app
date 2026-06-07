"use client";

import { useState } from "react";
import { Upload, Loader2, FileCheck, AlertCircle } from "lucide-react";
import { uploadMediaAction } from "@/lib/actions";

interface UploadMediaProps {
  onUploadSuccess: (url: string, mediaType: "image" | "video") => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export default function UploadMedia({ onUploadSuccess, allowedTypes, maxSizeMB = 10 }: UploadMediaProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setError("");
    setSuccessMsg("");
    setLoading(true);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      setLoading(false);
      return;
    }

    // Determine type
    const mediaType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadMediaAction(formData);
      if (res.success && res.url) {
        setSuccessMsg(`Uploaded successfully!`);
        onUploadSuccess(res.url, mediaType);
      } else {
        setError(res.error || "Failed to upload file.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6 border border-dashed border-white/20 hover:border-primary/50 rounded-2xl bg-[#161D30]/30 hover:bg-[#161D30]/50 transition-all cursor-pointer text-center relative group">
        <input
          type="file"
          accept={allowedTypes ? allowedTypes.join(",") : "image/*,video/*"}
          onChange={handleUpload}
          disabled={loading}
          className="hidden"
        />

        {loading ? (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-xs font-semibold text-foreground">Uploading media file...</p>
            <p className="text-[10px] text-muted-foreground">Uploading directly to Supabase Storage</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-2.5 rounded-full bg-white/5 inline-block text-muted-foreground group-hover:text-primary transition-all">
              <Upload size={22} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">Click to upload media</p>
              <p className="text-[10px] text-muted-foreground">
                Supports Images & Short Videos (MP4) up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </label>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-xl animate-fade-in">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl animate-fade-in">
          <FileCheck size={14} className="flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
