import React, { useState, useEffect } from "react"
import ReactPlayer from 'react-player'

interface VideoPlayerProps {
  url: string
  playing?: boolean
  onReady?: () => void
  onError?: (error: any) => void
  onEnded?: () => void
}

export function VideoPlayer({ url, playing = false, onReady, onError, onEnded }: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [url])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading player...</div>
      </div>
    )
  }

  // ReactPlayer handles YouTube URLs nicely without custom parsing
  // Casting to any to avoid TypeScript errors regarding 'url' prop not existing on the type definition
  const Player = ReactPlayer as any;

  return (
    <div className="w-full h-full bg-black">
        <Player
            url={url}
            playing={playing}
            controls={true}
            width="100%"
            height="100%"
            onReady={onReady}
            onError={onError}
            onEnded={onEnded}
        />
    </div>
  )
}