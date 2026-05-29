import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Share2, Music, Bookmark, Sparkles, Coins, Send, Check } from "lucide-react";
import { Post, User } from "../types";

interface ReelsProps {
  reels: Post[];
  currentUser: User;
  onLikeReel: (reelId: string) => void;
  onTipCreator: (amount: number, creatorUsername: string) => void;
}

export default function Reels({ reels, currentUser, onLikeReel, onTipCreator }: ReelsProps) {
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [tipSuccess, setTipSuccess] = useState(false);
  const [tipCustomAmount, setTipCustomAmount] = useState("10.00");
  const [activeCommentsIdx, setActiveCommentsIdx] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleSendTip = () => {
    const amountFloat = parseFloat(tipCustomAmount);
    if (isNaN(amountFloat) || amountFloat <= 0) return;

    if (currentUser.walletBalance < amountFloat) {
      alert("⚠️ Carteira insuficiente! Faça uma recarga ou escolha outro valor.");
      return;
    }

    const targetCreator = reels[activeReelIdx]?.username || "criador_incrivel";
    onTipCreator(amountFloat, targetCreator);
    setTipSuccess(true);
    setTimeout(() => {
      setTipSuccess(false);
      setTipsModalOpen(false);
    }, 2000);
  };

  const handlePostReelComment = (e: React.FormEvent, reelIndex: number) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const targetReel = reels[reelIndex];
    if (targetReel) {
      targetReel.comments.push({
        id: Math.random().toString(),
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        text: newComment,
        createdAt: "Agora",
        likesCount: 0
      });
      targetReel.commentsCount += 1;
    }
    setNewComment("");
  };

  const activeReel = reels[activeReelIdx];

  return (
    <div className="relative h-[80vh] w-full bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col md:max-w-md md:mx-auto border border-zinc-800" id="reels-main-container">
      {/* Scrollable vertical reels */}
      {reels.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-400">
          <Music className="w-12 h-12 text-zinc-500 mb-4 animate-pulse" />
          <p className="text-sm font-semibold">Nenhum Reel publicado ainda</p>
          <p className="text-xs text-zinc-650 mt-1">Publique um Reel de vídeo curto na aba Publicar!</p>
        </div>
      ) : (
        <div className="relative flex-1 h-full w-full">
          {/* Active Reel visual template item */}
          <div className="absolute inset-0 w-full h-full bg-zinc-950">
            {/* Dark vignette gradient protection */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10 pointer-events-none" />

            <img
              src={activeReel.media[0]}
              alt="Reel visual track"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />

            {/* AI Smart recommendation badge */}
            <div className="absolute top-4 left-4 z-20 bg-violet-600/80 backdrop-blur-md border border-violet-400/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_4px_15px_rgba(139,92,246,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">
                Aura Loop Ativo
              </span>
            </div>

            {/* Left Hand: Creator Profile, Verification Badge, Song info */}
            <div className="absolute bottom-6 left-4 right-16 z-20 text-left text-white space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeReel.userAvatar}
                  alt={activeReel.username}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold font-display">{activeReel.username}</span>
                    {activeReel.isVerified && (
                      <span className="text-[9px] bg-blue-500 py-0.5 px-1 rounded-full text-white font-extrabold">✓</span>
                    )}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-medium">Seguir criador</span>
                </div>
              </div>

              {/* Caption details scrolling */}
              <p className="text-xs font-medium text-zinc-200 line-clamp-2 leading-relaxed">
                {activeReel.caption}
              </p>

              {/* Soundtrack title marquee representation */}
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full inline-flex border border-zinc-700/30 max-w-[80vw]">
                <Music className="w-3 h-3 text-fuchsia-400 animate-spin" style={{ animationDuration: "3s" }} />
                <span className="text-[9.5px] font-bold text-zinc-300 truncate">
                  Som original - {activeReel.username} • 2026 Vibes
                </span>
              </div>
            </div>

            {/* Right Hand: Interactive Side Control Panel */}
            <div className="absolute bottom-6 right-3 z-20 flex flex-col items-center gap-5">
              {/* Creator Support monetization button */}
              <button
                onClick={() => setTipsModalOpen(true)}
                className="w-11 h-11 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
                id="btn-tip-creator"
                title="Apoiar com Gorjeta"
              >
                <Coins className="w-5 h-5 text-white animate-bounce" />
              </button>

              {/* Reel Likes */}
              <button
                onClick={() => onLikeReel(activeReel.id)}
                className="flex flex-col items-center gap-1 group text-white"
                id={`btn-reel-like-${activeReel.id}`}
              >
                <div className="w-11 h-11 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center transition border border-white/10">
                  <Heart
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      activeReel.hasLiked ? "text-rose-500 fill-rose-500" : ""
                    }`}
                  />
                </div>
                <span className="text-[10px] font-bold">{activeReel.likesCount}</span>
              </button>

              {/* Reel Comments Panel toggle */}
              <button
                onClick={() => setActiveCommentsIdx(activeCommentsIdx === activeReelIdx ? null : activeReelIdx)}
                className="flex flex-col items-center gap-1 group text-white"
                id="btn-reel-comments"
              >
                <div className="w-11 h-11 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center transition border border-white/10">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110" />
                </div>
                <span className="text-[10px] font-bold">{activeReel.commentsCount}</span>
              </button>

              {/* Fast Sharing toggle */}
              <button className="flex flex-col items-center gap-1 text-white">
                <div className="w-11 h-11 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center transition border border-white/10">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold">Share</span>
              </button>

              {/* Simple Next Reel toggle */}
              <button
                onClick={() => {
                  setActiveReelIdx((prev) => (prev + 1) % reels.length);
                  setActiveCommentsIdx(null);
                }}
                className="w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-xs font-bold text-white transition mt-2 border border-white/10"
                id="btn-next-reel"
              >
                PRÓX
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded comments side sheet for vertical screen height constraint */}
      <AnimatePresence>
        {activeCommentsIdx !== null && activeReel && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="absolute bottom-0 inset-x-0 z-30 bg-zinc-950/95 border-t border-zinc-800 p-4 rounded-t-3xl max-h-[50%]"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Mensagens & Comentários</span>
              <button onClick={() => setActiveCommentsIdx(null)} className="text-zinc-500 text-xs font-semibold hover:text-white py-1 px-2.5">
                Ocultar
              </button>
            </div>

            <div className="overflow-y-auto max-h-[14vh] space-y-2 mb-3 pr-1 text-left no-scrollbar">
              {activeReel.comments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[11px] text-zinc-500">Nenhum comentário. Publique o primeiro agora!</p>
                </div>
              ) : (
                activeReel.comments.map((cmt) => (
                  <div key={cmt.id} className="text-xs flex gap-2">
                    <span className="font-bold text-violet-400 shrink-0">{cmt.username}:</span>
                    <span className="text-zinc-300 leading-normal">{cmt.text}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={(e) => handlePostReelComment(e, activeReelIdx)} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
              <input
                type="text"
                placeholder="Adicionar comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 outline-none pl-2.5"
                id="input-reel-comment"
              />
              <button type="submit" className="px-3 py-1.5 bg-violet-600 rounded-lg text-[10px] font-bold text-white hover:bg-violet-500" id="btn-submit-reel-comment">
                Enviar
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creator Gorjeta / Tipping Sheet Overlay */}
      <AnimatePresence>
        {tipsModalOpen && reels[activeReelIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center p-4 text-white"
            id="tips-overlay-portal"
          >
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 w-full max-w-xs text-center space-y-4 shadow-xl">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Coins className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold">Apoiar @{reels[activeReelIdx].username}</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                  Sua gorjeta é enviada instantaneamente pelo saldo da carteira digital.
                </p>
              </div>

              {tipSuccess ? (
                <div className="py-2 flex flex-col items-center gap-1 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                  <Check className="w-6 h-6 shrink-0" />
                  <span className="text-xs font-bold">Gorjeta Enviada!</span>
                </div>
              ) : (
                <>
                  <div className="flex bg-zinc-950 p-2 rounded-2xl border border-zinc-800 items-center justify-center gap-1">
                    <span className="text-zinc-500 font-mono text-xs">R$</span>
                    <input
                      type="number"
                      value={tipCustomAmount}
                      onChange={(e) => setTipCustomAmount(e.target.value)}
                      className="w-20 bg-transparent text-center text-sm font-extrabold text-white outline-none font-mono"
                      step="5"
                      id="input-tip-amount"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 50].map((val) => (
                      <button
                        key={val}
                        onClick={() => setTipCustomAmount(val.toFixed(2))}
                        className="py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold"
                        type="button"
                      >
                        R$ {val}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setTipsModalOpen(false)}
                      className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                      id="btn-cancel-tip"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSendTip}
                      className="flex-1 py-2 bg-amber-500 text-black font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                      id="btn-confirm-tip"
                    >
                      Enviar PIX
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
