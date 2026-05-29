import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Volume2, VolumeX, Eye, Flame, Heart, Smile } from "lucide-react";
import { Story } from "../types";

interface StoriesProps {
  stories: Story[];
  onViewStory: (storyId: string) => void;
  onReactStory: (storyId: string, reaction: string) => void;
}

export default function Stories({ stories, onViewStory, onReactStory }: StoriesProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animate progress of the active story view
  useEffect(() => {
    if (!activeStory) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Auto close after 5 seconds
          handleClose();
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 100 intervals of 50ms = 5000ms (5 seconds)

    return () => clearInterval(interval);
  }, [activeStory]);

  const handleOpen = (story: Story) => {
    setActiveStory(story);
    onViewStory(story.id);
  };

  const handleClose = () => {
    setActiveStory(null);
    setProgress(0);
  };

  const handleHeartReaction = () => {
    if (activeStory) {
      onReactStory(activeStory.id, "❤️");
      // Local instant feedback decoration inside the modal
      setActiveStory(prev => prev ? { ...prev, reactionsCount: (prev.reactionsCount || 0) + 1 } : null);
    }
  };

  const handleFireReaction = () => {
    if (activeStory) {
      onReactStory(activeStory.id, "🔥");
      setActiveStory(prev => prev ? { ...prev, reactionsCount: (prev.reactionsCount || 0) + 1 } : null);
    }
  };

  return (
    <div id="stories-strip" className="border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-4">
      {/* Stories list */}
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => handleOpen(story)}
          className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none focus:scale-95 transition-all text-left"
          id={`story-btn-${story.id}`}
        >
          {/* Circular avatar box outline with dynamic status */}
          <div className={`p-[2px] rounded-full flex items-center justify-center bg-gradient-to-tr ${
            story.isViewed ? "from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800" : "from-violet-500 via-fuchsia-500 to-pink-500"
          }`}>
            <div className="p-[2.5px] bg-white dark:bg-zinc-950 rounded-full">
              <img
                src={story.userAvatar}
                alt={story.username}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
          </div>
          <span className="text-[10.5px] font-semibold text-zinc-600 dark:text-zinc-400 max-w-[65px] truncate">
            {story.username}
          </span>
        </button>
      ))}

      {/* Story Viewer Overlay Fullscreen Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white"
            id="story-modal-viewer"
          >
            <div className="relative w-full h-full max-w-lg mx-auto flex flex-col justify-between p-4 bg-zinc-950 md:rounded-3xl md:h-[94vh]">
              {/* Top Progress Bars and Controls */}
              <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-3">
                {/* Horizontal Progress bar */}
                <div className="w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Author Info and Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeStory.userAvatar}
                      alt={activeStory.username}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-violet-500/50"
                    />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1">
                        {activeStory.username}
                        {activeStory.isVerified && (
                          <span className="text-[9px] bg-blue-500 text-white p-0.5 rounded-full">✓</span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">
                        {activeStory.createdAt}
                      </div>
                    </div>
                  </div>

                  {/* Top Bar Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 hover:bg-zinc-800/50 rounded-full transition"
                      id="story-btn-mute"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                    <button
                      onClick={handleClose}
                      className="p-1.5 hover:bg-zinc-800/50 rounded-full transition"
                      id="story-btn-close"
                    >
                      <X className="w-5 h-5 text-zinc-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Story Content Viewport */}
              <div className="flex-1 flex items-center justify-center relative rounded-2xl overflow-hidden mt-12 bg-zinc-900 group">
                <img
                  src={activeStory.media}
                  alt="Story Content"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Music Badge Overlay Simulation */}
                <div className="absolute bottom-6 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-zinc-500/20 max-w-[80%]">
                  <div className="animate-bounce w-1.5 h-1.5 bg-violet-400 rounded-full" />
                  <span className="text-[10px] font-semibold tracking-wide truncate">
                    Ambient Vibes Loop - Original Sound
                  </span>
                </div>
              </div>

              {/* Bottom Interactive Reactions Frame */}
              <div className="relative z-25 mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleHeartReaction}
                  className="flex-1 h-11 bg-zinc-900/80 hover:bg-zinc-900 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs border border-zinc-800/60 active:scale-95 transition-all text-red-400 hover:text-red-300 cursor-pointer"
                  id="story-btn-like"
                >
                  <Heart className="w-4 h-4 fill-red-400/20" />
                  Gostar
                </button>
                <button
                  type="button"
                  onClick={handleFireReaction}
                  className="flex-1 h-11 bg-zinc-900/80 hover:bg-zinc-900 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs border border-zinc-800/60 active:scale-95 transition-all text-amber-400 hover:text-amber-300 cursor-pointer"
                  id="story-btn-react"
                >
                  <Flame className="w-4 h-4" />
                  Fogo
                </button>
                <div className="bg-zinc-900/60 border border-zinc-800 h-11 px-3.5 rounded-2xl flex items-center gap-1.5 text-zinc-400 font-mono text-[10.5px]">
                  <Eye className="w-3.5 h-3.5" />
                  {activeStory.reactionsCount || 0}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
