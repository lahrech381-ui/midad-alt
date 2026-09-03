"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title: string;
  scholar?: string;
}

export function AudioPlayer({ src, title, scholar }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const onLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
    };

    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-xl p-4 shadow-lg">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="bg-white rounded-full p-3 hover:bg-emerald-100 transition-colors flex-shrink-0"
          aria-label={isPlaying ? "إيقاف" : "تشغيل"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-emerald-900" />
          ) : (
            <Play className="w-6 h-6 text-emerald-900" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold truncate">{title}</p>
          {scholar && <p className="text-emerald-200 text-sm truncate">{scholar}</p>}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-emerald-200 text-xs w-10 text-left">{currentTime}</span>
            <div
              className="flex-1 h-2 bg-emerald-700 rounded-full cursor-pointer group"
              onClick={seek}
            >
              <div
                className="h-full bg-white rounded-full transition-all group-hover:bg-emerald-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-emerald-200 text-xs w-10 text-right">{duration}</span>
          </div>

          <div className="flex items-center justify-center gap-4 mt-2">
            <button onClick={() => skip(-10)} className="text-emerald-200 hover:text-white" aria-label="رجوع 10 ثوان">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={() => skip(10)} className="text-emerald-200 hover:text-white" aria-label="تقديم 10 ثوان">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button onClick={toggleMute} className="text-white flex-shrink-0" aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
