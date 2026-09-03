"use client";

import { useAudio } from "@/lib/audio-context";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X, ListMusic } from "lucide-react";
import { useState } from "react";

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const { currentTrack, isPlaying, progress, duration, volume, toggle, next, prev, seek, setVolume, pause, playlist } = useAudio();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [muted, setMuted] = useState(false);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* Playlist popup */}
      {showPlaylist && (
        <div className="fixed bottom-24 right-4 w-80 max-h-96 bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden z-50">
          <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4" />
              <span className="font-medium text-sm">القائمة ({playlist.length})</span>
            </div>
            <button onClick={() => setShowPlaylist(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-72">
            {playlist.map((t, i) => (
              <button
                key={t.id}
                onClick={() => {
                  const audio = new Audio(t.url);
                  audio.play();
                }}
                className={`w-full text-right px-4 py-2.5 border-b border-gray-100 hover:bg-emerald-50 transition-colors ${
                  currentTrack.id === t.id ? "bg-emerald-100" : ""
                }`}
              >
                <p className="text-sm font-medium text-emerald-900 truncate">{t.title}</p>
                {t.scholar && <p className="text-xs text-gray-500 truncate">{t.scholar}</p>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Player bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-emerald-900 text-white z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        {/* Progress bar */}
        <div
          className="h-1 bg-emerald-700 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            seek(percent * duration);
          }}
        >
          <div
            className="h-full bg-emerald-400 transition-all group-hover:bg-emerald-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{currentTrack.title}</p>
            <p className="text-emerald-300 text-xs truncate">
              {currentTrack.scholar || ""}
              {currentTrack.collection ? ` - ${currentTrack.collection}` : ""}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button onClick={prev} className="p-2 hover:bg-emerald-800 rounded-full transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={toggle}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={next} className="p-2 hover:bg-emerald-800 rounded-full transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Time */}
          <div className="text-xs text-emerald-300 hidden sm:block">
            {formatTime(progress)} / {formatTime(duration)}
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                setMuted(!muted);
                setVolume(muted ? volume : 0);
              }}
              className="p-2 hover:bg-emerald-800 rounded-full transition-colors"
            >
              {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                setMuted(v === 0);
              }}
              className="w-20 accent-emerald-400"
            />
          </div>

          {/* Playlist toggle */}
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-2 rounded-full transition-colors ${
              showPlaylist ? "bg-emerald-600" : "hover:bg-emerald-800"
            }`}
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
