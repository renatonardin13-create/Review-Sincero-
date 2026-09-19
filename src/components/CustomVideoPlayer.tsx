import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  FastForward,
  Rewind,
  Sparkles,
  ShieldCheck,
  Tv,
  CheckCircle2,
  Settings,
  Flame,
  Award
} from 'lucide-react';
import { extractYouTubeId } from '../utils/youtubeHelper';

interface CustomVideoPlayerProps {
  videoUrlOrId: string;
  title: string;
  moduleName?: string;
  duration?: string;
  onEnded?: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
  onMarkCompleted?: () => void;
  isCompleted?: boolean;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrlOrId,
  title,
  moduleName,
  duration,
  onEnded,
  onNextLesson,
  hasNextLesson,
  onMarkCompleted,
  isCompleted
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(() => {
    if (duration) {
      const parts = duration.split(':').map(Number);
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 600; // default 10 min
  });
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [videoEnded, setVideoEnded] = useState<boolean>(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);

  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeTrackerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if it's YouTube or direct MP4
  const isDirectVideo = videoUrlOrId?.endsWith('.mp4') || videoUrlOrId?.endsWith('.webm') || videoUrlOrId?.includes('/video/');
  const youtubeId = !isDirectVideo ? extractYouTubeId(videoUrlOrId) : null;

  // Send command to YouTube iframe
  const sendYoutubeCommand = useCallback((func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func,
          args
        }),
        '*'
      );
    }
  }, []);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (totalSec: number) => {
    if (isNaN(totalSec) || totalSec < 0) return '00:00';
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = Math.floor(totalSec % 60);
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Reset player state when video changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setVideoEnded(false);
    setHasStartedPlaying(false);

    if (duration) {
      const parts = duration.split(':').map(Number);
      if (parts.length === 2) setDurationSeconds(parts[0] * 60 + parts[1]);
      if (parts.length === 3) setDurationSeconds(parts[0] * 3600 + parts[1] * 60 + parts[2]);
    }
  }, [videoUrlOrId, duration]);

  // Handle Fullscreen Changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle YouTube postMessage events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.event === 'onStateChange') {
          // 1: playing, 2: paused, 0: ended, 3: buffering
          if (data.info === 1) {
            setIsPlaying(true);
            setIsBuffering(false);
            setVideoEnded(false);
            setHasStartedPlaying(true);
          } else if (data.info === 2) {
            setIsPlaying(false);
            setIsBuffering(false);
          } else if (data.info === 0) {
            setIsPlaying(false);
            setVideoEnded(true);
            if (onEnded) onEnded();
            if (onMarkCompleted) onMarkCompleted();
          } else if (data.info === 3) {
            setIsBuffering(true);
          }
        }
        if (data.info && typeof data.info.currentTime === 'number') {
          setCurrentTime(data.info.currentTime);
        }
        if (data.info && typeof data.info.duration === 'number' && data.info.duration > 0) {
          setDurationSeconds(data.info.duration);
        }
      } catch (e) {
        // Not a JSON message or unrelated message
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEnded, onMarkCompleted]);

  // Local time tracker for YouTube / Direct video when playing
  useEffect(() => {
    if (isPlaying) {
      timeTrackerIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev + 1 >= durationSeconds) {
            setIsPlaying(false);
            setVideoEnded(true);
            if (onEnded) onEnded();
            return durationSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    } else {
      if (timeTrackerIntervalRef.current) clearInterval(timeTrackerIntervalRef.current);
    }
    return () => {
      if (timeTrackerIntervalRef.current) clearInterval(timeTrackerIntervalRef.current);
    };
  }, [isPlaying, durationSeconds, playbackRate, onEnded]);

  // Control visibility timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 2500);
    }
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (isDirectVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setHasStartedPlaying(true);
      }
    } else {
      if (isPlaying) {
        sendYoutubeCommand('pauseVideo');
        setIsPlaying(false);
      } else {
        sendYoutubeCommand('playVideo');
        setIsPlaying(true);
        setHasStartedPlaying(true);
        setVideoEnded(false);
      }
    }
  };

  // Seek To
  const handleSeek = (seconds: number) => {
    const target = Math.max(0, Math.min(seconds, durationSeconds));
    setCurrentTime(target);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.currentTime = target;
    } else {
      sendYoutubeCommand('seekTo', [target, true]);
    }
  };

  // Jump 10s
  const handleJump = (delta: number) => {
    handleSeek(currentTime + delta);
  };

  // Volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    } else {
      sendYoutubeCommand('setVolume', [newVol * 100]);
      if (newVol === 0) {
        sendYoutubeCommand('mute');
      } else {
        sendYoutubeCommand('unMute');
      }
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      handleVolumeChange(volume || 0.8);
    } else {
      setIsMuted(true);
      if (isDirectVideo && videoRef.current) {
        videoRef.current.muted = true;
      } else {
        sendYoutubeCommand('mute');
      }
    }
  };

  // Playback Rate
  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.playbackRate = rate;
    } else {
      sendYoutubeCommand('setPlaybackRate', [rate]);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error('Exit fullscreen error:', err);
      });
    }
  };

  // Custom YouTube White-label Embed URL
  const embedUrl = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&origin=${encodeURIComponent(
        typeof window !== 'undefined' ? window.location.origin : ''
      )}`
    : '';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-[#05070B] rounded-3xl overflow-hidden shadow-2xl border border-[#1E293B] group select-none flex items-center justify-center"
    >
      {/* 1. ACTUAL VIDEO BACKEND */}
      {isDirectVideo ? (
        <video
          ref={videoRef}
          src={videoUrlOrId}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              if (videoRef.current.duration) {
                setDurationSeconds(videoRef.current.duration);
              }
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setVideoEnded(true);
            if (onEnded) onEnded();
            if (onMarkCompleted) onMarkCompleted();
          }}
          className="w-full h-full object-cover"
        />
      ) : youtubeId ? (
        <div className="relative w-full h-full overflow-hidden pointer-events-none">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-[110%] h-[110%] -mt-[2%] -ml-[5%] border-0"
          />
        </div>
      ) : (
        <div className="text-center p-8 space-y-3 z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#131B2A] border border-[#24334A] flex items-center justify-center mx-auto text-[#F5C542]">
            <Tv className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Nenhum vídeo configurado</h4>
            <p className="text-xs text-[#94A3B8]">
              Adicione o link do YouTube na edição desta aula para liberar o player.
            </p>
          </div>
        </div>
      )}

      {/* 2. ANTI-BRANDING SECURITY MASKS (Permanently hides YouTube title, watch later, share, and watermark) */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#080808]/90 via-[#080808]/40 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 w-32 h-16 bg-gradient-to-tl from-[#080808]/90 to-transparent pointer-events-none z-20" />

      {/* 3. PERMANENT BRAND WATERMARK (Top-Left) */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C0F17]/90 backdrop-blur-md border border-[#F5C542]/30 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#F5C542] animate-pulse" />
          <span className="text-[11px] font-black tracking-wider text-white uppercase">
            Review Sincero <span className="text-[#F5C542]">Academy</span>
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5C542] text-[#080808] ml-1">
            VIP
          </span>
        </div>
      </div>

      {/* 4. TOP-RIGHT VIDEO QUALITY & MODULE BADGE */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 pointer-events-none">
        {moduleName && (
          <span className="hidden sm:inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#0C0F17]/80 backdrop-blur-md text-[#94A3B8] border border-[#1E293B]">
            {moduleName.split(':')[0]}
          </span>
        )}
        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-[#131B2A]/90 backdrop-blur-md text-[#38BDF8] border border-[#24334A] shadow-md">
          1080p FULL HD
        </span>
      </div>

      {/* 5. CLICKABLE VIDEO STAGE (Single click toggles play/pause) */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 z-10 cursor-pointer"
        title={isPlaying ? 'Clique para pausar' : 'Clique para reproduzir'}
      />

      {/* 6. BIG CENTRAL PLAY BUTTON (When paused or not started) */}
      {(!isPlaying || !hasStartedPlaying) && !videoEnded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative group/play">
            <div className="absolute -inset-4 bg-[#F5C542]/20 rounded-full blur-xl animate-pulse" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="relative w-20 h-20 rounded-full bg-[#F5C542] text-[#080808] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer border-2 border-white/40"
              title="Iniciar Videoaula"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* 7. VIDEO ENDED OVERLAY (Congratulates & prompts next lesson) */}
      {videoEnded && (
        <div className="absolute inset-0 z-30 bg-[#080808]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-black text-white">Aula Concluída com Sucesso!</h3>
            <p className="text-xs text-[#94A3B8]">
              Você finalizou <span className="text-white font-semibold">{title}</span>. Continue avançando na sua jornada!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                handleSeek(0);
                togglePlay();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white text-xs font-bold border border-[#24334A] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Assistir Novamente</span>
            </button>

            {hasNextLesson && onNextLesson && (
              <button
                type="button"
                onClick={onNextLesson}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] text-xs font-black shadow-lg shadow-[#F5C542]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Próxima Aula</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 8. CUSTOM BOTTOM CONTROL BAR */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent pt-8 pb-3 px-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar & Scrubber */}
        <div className="relative mb-3 group/progress">
          <input
            type="range"
            min={0}
            max={durationSeconds || 100}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-1.5 group-hover/progress:h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#F5C542] transition-all"
            style={{
              background: `linear-gradient(to right, #F5C542 0%, #F5C542 ${
                (currentTime / (durationSeconds || 1)) * 100
              }%, #1E293B ${(currentTime / (durationSeconds || 1)) * 100}%, #1E293B 100%)`
            }}
          />
        </div>

        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-3 text-white">
          {/* Left: Play/Pause, Skip 10s, Volume, Time */}
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-2 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white hover:text-[#F5C542] border border-[#24334A] transition-all cursor-pointer"
              title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Rewind 10s */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleJump(-10);
              }}
              className="p-2 rounded-xl bg-[#131B2A]/70 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#24334A] transition-all cursor-pointer"
              title="Voltar 10s"
            >
              <Rewind className="w-4 h-4" />
            </button>

            {/* FastForward 10s */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleJump(10);
              }}
              className="p-2 rounded-xl bg-[#131B2A]/70 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#24334A] transition-all cursor-pointer"
              title="Avançar 10s"
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Volume & Mute */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="p-2 rounded-xl bg-[#131B2A]/70 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#24334A] transition-all cursor-pointer"
                title={isMuted ? 'Desmutar' : 'Mutar'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-14 sm:w-20 h-1 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#F5C542]"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-xs font-mono font-bold text-[#94A3B8] ml-2">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(durationSeconds)}</span>
            </div>
          </div>

          {/* Right: Playback Speed, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Speed Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu(!showSpeedMenu);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white border border-[#24334A] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Velocidade de reprodução"
              >
                <span>{playbackRate}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-28 bg-[#0C0F17] border border-[#1E293B] rounded-xl p-1.5 shadow-2xl z-40 space-y-1">
                  {[0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeedChange(rate);
                      }}
                      className={`w-full text-left px-2.5 py-1 rounded-lg text-xs font-bold flex items-center justify-between cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-[#F5C542] text-[#080808]'
                          : 'text-[#94A3B8] hover:text-white hover:bg-[#131B2A]'
                      }`}
                    >
                      <span>{rate}x</span>
                      {rate === 1 && <span className="text-[10px] opacity-70">Normal</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-2 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-white hover:text-[#F5C542] border border-[#24334A] transition-all cursor-pointer"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
