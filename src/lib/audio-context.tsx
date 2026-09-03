"use client";

import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react";

export interface Track {
  id: string;
  title: string;
  url: string;
  scholar?: string;
  collection?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

interface AudioContextType {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: (track: Track, playlist?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  next: () => void;
  prev: () => void;
  playCollection: (tracks: Track[], startIndex?: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.addEventListener("timeupdate", () => {
        setProgress(audioRef.current?.currentTime || 0);
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener("ended", () => {
        // Auto next
        const idx = playlist.findIndex((t) => t.id === currentTrack?.id);
        if (idx >= 0 && idx < playlist.length - 1) {
          const nextTrack = playlist[idx + 1];
          setCurrentTrack(nextTrack);
          if (audioRef.current) {
            audioRef.current.src = nextTrack.url;
            audioRef.current.play();
          }
        } else {
          setIsPlaying(false);
        }
      });
    }
    return audioRef.current;
  }, [currentTrack, playlist, volume]);

  const play = useCallback(
    (track: Track, newPlaylist?: Track[]) => {
      if (newPlaylist) setPlaylist(newPlaylist);
      setCurrentTrack(track);
      const audio = getAudio();
      audio.src = track.url;
      audio.play();
      setIsPlaying(true);
    },
    [getAudio]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else resume();
  }, [isPlaying, pause, resume]);

  const seek = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setProgress(time);
      }
    },
    []
  );

  const setVolume = useCallback(
    (vol: number) => {
      setVolumeState(vol);
      if (audioRef.current) audioRef.current.volume = vol;
    },
    []
  );

  const next = useCallback(() => {
    const idx = playlist.findIndex((t) => t.id === currentTrack?.id);
    if (idx >= 0 && idx < playlist.length - 1) {
      const nextTrack = playlist[idx + 1];
      play(nextTrack);
    }
  }, [playlist, currentTrack, play]);

  const prev = useCallback(() => {
    const idx = playlist.findIndex((t) => t.id === currentTrack?.id);
    if (idx > 0) {
      const prevTrack = playlist[idx - 1];
      play(prevTrack);
    }
  }, [playlist, currentTrack, play]);

  const playCollection = useCallback(
    (tracks: Track[], startIndex: number = 0) => {
      if (tracks.length === 0) return;
      setPlaylist(tracks);
      play(tracks[startIndex], tracks);
    },
    [play]
  );

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        progress,
        duration,
        volume,
        play,
        pause,
        resume,
        toggle,
        seek,
        setVolume,
        next,
        prev,
        playCollection,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
