"use client";

import { useEffect, useRef, useState } from "react";

const SPEEDS = [0.25, 0.5, 0.75, 1];

export default function SideBySidePlayer({
  videoFile,
  referenceVideoUrl,
  proName,
}: {
  videoFile: File;
  referenceVideoUrl: string;
  proName: string;
}) {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const proVideoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userUrl, setUserUrl] = useState<string | null>(null);

  // Create object URL for user video
  useEffect(() => {
    const url = URL.createObjectURL(videoFile);
    setUserUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  // Sync playback speed
  useEffect(() => {
    if (userVideoRef.current) {
      userVideoRef.current.playbackRate = speed;
    }
    if (proVideoRef.current) {
      proVideoRef.current.playbackRate = speed;
    }
  }, [speed]);

  function togglePlay() {
    if (isPlaying) {
      userVideoRef.current?.pause();
      proVideoRef.current?.pause();
      setIsPlaying(false);
    } else {
      userVideoRef.current?.play();
      proVideoRef.current?.play();
      setIsPlaying(true);
    }
  }

  function restart() {
    if (userVideoRef.current) {
      userVideoRef.current.currentTime = 0;
      userVideoRef.current.pause();
    }
    if (proVideoRef.current) {
      proVideoRef.current.currentTime = 0;
      proVideoRef.current.pause();
    }
    setIsPlaying(false);
  }

  return (
    <div className="space-y-4">
      {/* Videos side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* User video */}
        <div>
          <div className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-white/40">
            Your video
          </div>
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            {userUrl && (
              <video
                ref={userVideoRef}
                src={userUrl}
                className="h-full w-full object-contain"
                playsInline
                muted
              />
            )}
          </div>
        </div>

        {/* Pro reference */}
        <div>
          <div className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-white/40">
            {proName}
          </div>
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            <video
              ref={proVideoRef}
              src={referenceVideoUrl}
              className="h-full w-full object-contain"
              playsInline
              muted
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-black transition-opacity hover:opacity-80"
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="1" y="0" width="4" height="14" rx="1" />
                <rect x="9" y="0" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M2 0.5 L13 7 L2 13.5Z" />
              </svg>
            )}
          </button>
          <button
            onClick={restart}
            className="text-xs text-white/50 hover:text-white"
          >
            Restart
          </button>
        </div>

        {/* Speed controls */}
        <div className="flex items-center gap-1">
          <span className="mr-2 font-mono text-xs text-white/40">Speed</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-all duration-[120ms] ${
                speed === s
                  ? "bg-accent text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
