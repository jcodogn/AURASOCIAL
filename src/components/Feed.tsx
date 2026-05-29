import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Bookmark, Share2, Sparkles, MapPin, Send, MessageSquareText, ShieldAlert, BadgeCheck, FileText } from "lucide-react";
import { Post, Comment, User } from "../types";

interface FeedProps {
  posts: Post[];
  currentUser: User;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAISort: () => void;
  aiSorted: boolean;
  isSorting: boolean;
}

export default function Feed({
  posts,
  currentUser,
  onLikePost,
  onSavePost,
  onAddComment,
  onAISort,
  aiSorted,
  isSorting,
}: FeedProps) {
  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");
  const [moderateStatus, setModerateStatus] = useState<string | null>(null);
  const [isModerating, setIsModerating] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsModerating(true);
    setModerateStatus("Moderando por IA...");

    try {
      // Test safety validation via our backend AI node
      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });
      const decision = await res.json();

      if (decision.safe) {
        onAddComment(postId, commentText);
        setCommentText("");
        setModerateStatus(null);
      } else {
        setModerateStatus(`🛑 Bloqueado por IA: ${decision.reason}`);
        setTimeout(() => setModerateStatus(null), 4000);
      }
    } catch (err) {
      // Fallback on error
      onAddComment(postId, commentText);
      setCommentText("");
      setModerateStatus(null);
    } finally {
      setIsModerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-24" id="feed-component">
      {/* Header and Smart AI Filter Ribbon */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-widest">Feed de Conteúdo</span>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            {aiSorted ? "✨ Ordenado por Inteligência Artificial" : "🔥 Postagens Recentes"}
          </span>
        </div>
        <button
          onClick={onAISort}
          disabled={isSorting}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            aiSorted
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-lg shadow-violet-500/20"
              : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-violet-500"
          }`}
          id="btn-ai-sort"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isSorting ? "animate-spin" : ""}`} />
          {isSorting ? "Processando..." : aiSorted ? "Aura AI Ativa" : "Ordenar por Interesse"}
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-100 dark:border-zinc-900 p-6">
          <MessageCircle className="w-12 h-12 text-zinc-400 mx-auto mb-4 stroke-1" />
          <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Nenhuma postagem ainda</h3>
          <p className="text-xs text-zinc-400 mt-1">Seja o primeiro a publicar algo legal na Aura!</p>
        </div>
      ) : (
        /* Post feeds */
        posts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 overflow-hidden shadow-sm transition-all text-left"
            id={`post-card-${post.id}`}
          >
            {/* Post Author Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.userAvatar}
                  alt={post.username}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20"
                />
                <div>
                  <div className="flex items-center gap-1 text-sm font-bold text-zinc-900 dark:text-white">
                    <span>{post.username}</span>
                    {post.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                    )}
                  </div>
                  {post.location && (
                    <div className="flex items-center gap-0.5 text-[10px] text-zinc-400 font-semibold mt-0.5">
                      <MapPin className="w-3 h-3 text-violet-400 shrink-0" />
                      <span>{post.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {post.isScheduled && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                  Agendado (Simulado)
                </span>
              )}
            </div>

            {/* Post Media Carousel Container */}
            <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center">
              {post.type === "video" ? (
                <div className="w-full h-full relative group">
                  {post.media[0] && (post.media[0].startsWith("data:video/") || post.media[0].endsWith(".mp4") || post.media[0].includes("video")) ? (
                    <video
                      src={post.media[0]}
                      controls
                      autoPlay={false}
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={post.media[0]}
                        alt="Cover video placeholder"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {/* Dynamic Playback Simulation Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-center justify-between">
                        <span className="text-xs text-white font-bold drop-shadow flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                          Visualizador de Vídeo Ativo
                        </span>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded backdrop-blur-md text-white font-semibold flex items-center gap-1">
                          MP4 HD
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : post.type === "file" ? (
                <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-violet-600/5 via-fuchsia-600/5 to-pink-500/5 hover:brightness-105 transition-all">
                  <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-3 border border-rose-500/25 shadow-lg">
                    <FileText className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/10">
                    {post.fileType?.split("/")[1]?.toUpperCase() || "PDF"} DOCUMENTO
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mt-3 px-6 truncate max-w-full">
                    {post.fileName || "documento_aura.pdf"}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Tamanho: <strong className="text-zinc-500 dark:text-zinc-300">{post.fileSize || "1.2 MB"}</strong>
                  </p>
                  
                  {/* Dynamic Download/View Action button */}
                  <a
                    href={post.media[0]}
                    download={post.fileName || "documento_anexo.pdf"}
                    className="mt-6 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white dark:text-zinc-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md select-none cursor-pointer border border-zinc-100 dark:border-zinc-800"
                  >
                    <span>Download / Baixar Arquivo</span>
                  </a>
                </div>
              ) : (
                <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                  {post.media.map((imgUrl, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-start">
                      <img
                        src={imgUrl}
                        alt={`Post ${post.id} slide ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Indicator dots for Carousel */}
              {post.media.length > 1 && (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                  {post.media.map((_, idx) => (
                    <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  ))}
                </div>
              )}
            </div>

            {/* Interaction Action Buttons Bar */}
            <div className="p-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
                <button
                  onClick={() => onLikePost(post.id)}
                  className="hover:scale-110 active:scale-95 transition-transform"
                  id={`btn-like-${post.id}`}
                >
                  <Heart
                    className={`w-6 h-6 stroke-2 ${
                      post.hasLiked ? "text-red-500 fill-red-500" : "hover:text-red-500"
                    }`}
                  />
                </button>
                <button
                  onClick={() => setActiveCommentPost(post)}
                  className="hover:scale-110 active:scale-95 transition-transform"
                  id={`btn-comment-${post.id}`}
                >
                  <MessageCircle className="w-6 h-6 stroke-2 hover:text-violet-500" />
                </button>
                <button className="hover:scale-110 active:scale-95 transition-transform">
                  <Share2 className="w-6 h-6 stroke-2 hover:text-fuchsia-500" />
                </button>
              </div>

              <button
                onClick={() => onSavePost(post.id)}
                className="hover:scale-110 active:scale-95 transition-transform text-zinc-700 dark:text-zinc-300"
                id={`btn-save-${post.id}`}
              >
                <Bookmark
                  className={`w-6 h-6 stroke-2 ${
                    post.hasSaved ? "text-violet-500 fill-violet-500" : "hover:text-violet-500"
                  }`}
                />
              </button>
            </div>

            {/* Post Metadata, Caption, and Popular Hashtags */}
            <div className="px-4 pb-4 space-y-1 bg-white dark:bg-zinc-950">
              <span className="text-sm font-extrabold text-zinc-900 dark:text-white">
                {post.likesCount.toLocaleString()} curtidas
              </span>

              <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                <span className="font-extrabold mr-1.5 text-zinc-900 dark:text-white">{post.username}</span>
                {post.caption}
              </p>

              {/* Hashtag badge strip */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 py-1">
                  {post.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold text-violet-500 hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold pt-1">
                <span>{post.createdAt}</span>
                <button
                  onClick={() => setActiveCommentPost(post)}
                  className="hover:text-violet-500 transition-colors"
                >
                  Ver todos os {post.comments.length} comentários
                </button>
              </div>
            </div>
          </article>
        ))
      )}

      {/* Modern bottom-sheet comment modal */}
      <AnimatePresence>
        {activeCommentPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
            id="comments-sheet-overlay"
          >
            {/* Backdrop close catch */}
            <div className="absolute inset-0" onClick={() => setActiveCommentPost(null)} />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-t-3xl p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[75vh]"
            >
              {/* Top Handle bar representation */}
              <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-6 shrink-0" />

              <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Comentários</h3>
                <button
                  onClick={() => setActiveCommentPost(null)}
                  className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                >
                  Fechar
                </button>
              </div>

              {/* Comments Scroll box */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 no-scrollbar">
                {activeCommentPost.comments.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xs text-zinc-400">Nenhum comentário na postagem. Seja o primeiro a dizer algo!</p>
                  </div>
                ) : (
                  activeCommentPost.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 text-left">
                      <img
                        src={comment.userAvatar}
                        alt={comment.username}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">
                            {comment.username}
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                            {comment.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-normal">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dynamic Status / AI Warning bar */}
              {moderateStatus && (
                <div className="mb-3 px-3.5 py-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-xl flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-semibold animate-pulse">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{moderateStatus}</span>
                </div>
              )}

              {/* Input Form with modern design features */}
              <form
                onSubmit={(e) => handleCommentSubmit(e, activeCommentPost.id)}
                className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shrink-0"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0 ml-1"
                />
                <input
                  type="text"
                  placeholder="Seu comentário sob moderação AI..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isModerating}
                  className="flex-1 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none placeholder:text-zinc-400"
                  id="input-new-comment"
                />
                <button
                  type="submit"
                  disabled={isModerating || !commentText.trim()}
                  className="p-2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-400 dark:disabled:bg-zinc-800 rounded-xl transition"
                  id="btn-submit-comment"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
