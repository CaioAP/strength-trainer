import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

/**
 * Custom Video Player for exercise tutorials.
 * Uses standard HTML5 video with a clean, branded UI.
 */
export const VideoPlayer = ({
  url,
  autoPlay = true,
  loop = true,
  className = "",
}: VideoPlayerProps): React.JSX.Element => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [error, setError] = React.useState(false);

  const togglePlay = (): void => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => setError(true));
    }
    setIsPlaying(!isPlaying);
  };

  const restart = (): void => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => setError(true));
    setIsPlaying(true);
  };

  return (
    <div className={`relative bg-black overflow-hidden group h-full w-full flex items-center justify-center ${className}`}>
      {error ? (
        <div className="text-center p-4">
          <p className="text-status-error text-xs font-bold uppercase tracking-widest">Failed to load video</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={url}
            autoPlay={autoPlay}
            loop={loop}
            muted
            playsInline
            className="w-full h-full object-contain"
            onClick={togglePlay}
          />
          
          {/* Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="flex gap-4 pointer-events-auto">
              <button 
                onClick={togglePlay}
                className="p-3 bg-brand-primary text-black rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
              <button 
                onClick={restart}
                className="p-3 bg-white/10 text-white backdrop-blur-md rounded-full hover:bg-white/20 transition-all shadow-lg"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Muted Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-[8px] font-bold text-white/60 uppercase tracking-widest">
            Muted
          </div>
        </>
      )}
    </div>
  );
};
