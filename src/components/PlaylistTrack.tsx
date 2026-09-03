"use client";

import { useAudio, type Track } from "@/lib/audio-context";
import { Play, Pause } from "lucide-react";

interface PlaylistTrackProps {
  track: Track;
  index: number;
  isActive?: boolean;
}

export function PlaylistTrack({ track, index, isActive }: PlaylistTrackProps) {
  const { currentTrack, isPlaying, toggle, play, playlist } = useAudio();
  const playing = currentTrack?.id === track.id && isPlaying;

  const handleClick = () => {
    if (currentTrack?.id === track.id) {
      toggle();
    } else {
      play(track, playlist.length > 0 ? playlist : undefined);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right ${
        isActive || currentTrack?.id === track.id
          ? "bg-emerald-100 border border-emerald-300"
          : "bg-white border border-emerald-100 hover:shadow-md hover:border-emerald-200"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          playing ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-600"
        }`}
      >
        {playing ? (
          <Pause className="w-4 h-4" />
        ) : (
          <span className="text-sm font-bold">{index + 1}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm truncate ${isActive || currentTrack?.id === track.id ? "text-emerald-800" : "text-emerald-900"}`}>
          {track.title}
        </p>
        {track.scholar && (
          <p className="text-xs text-gray-500 truncate">{track.scholar}</p>
        )}
      </div>
      {!playing && (
        <Play className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      )}
    </button>
  );
}
