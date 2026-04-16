"use client";

import { useRef, useState } from "react";

const MAX_SIZE_MB = 100;
const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];

export default function VideoUpload({
  file,
  onFileSelect,
}: {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function validate(f: File): string | null {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Please upload an MP4, MOV, WebM, or AVI file.";
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Max ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }

  function handleFile(f: File) {
    const err = validate(f);
    if (err) {
      setError(err);
      onFileSelect(null);
    } else {
      setError(null);
      onFileSelect(f);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-[120ms] ${
          dragOver
            ? "border-accent bg-accent/10"
            : file
              ? "border-accent/50 bg-accent-dim"
              : "border-white/20 bg-surface hover:border-white/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {file ? (
          <>
            <span className="text-lg font-medium text-accent">
              {file.name}
            </span>
            <span className="mt-1 text-sm text-white/50">
              {(file.size / 1024 / 1024).toFixed(1)} MB — click to change
            </span>
          </>
        ) : (
          <>
            <span className="text-lg text-white/60">
              Drop your video here or click to browse
            </span>
            <span className="mt-1 text-sm text-white/40">
              MP4, MOV, WebM, AVI — max {MAX_SIZE_MB}MB — trim to 10-20s for best results
            </span>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
